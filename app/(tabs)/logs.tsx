import { currentLiftModalStyles as modalStyles, LogsStyles as styles } from "@/assets";
import { TblCell } from "@/components";
import { useActiveWorkout } from "@/context/ActiveWorkoutContext";
import { getExercisesByWorkout } from "@/db/queries/exercises";
import { getProgramById, getPrograms } from "@/db/queries/programs";
import { getWeightEntriesByExercises } from "@/db/queries/weights";
import { getWorkoutsByProgram } from "@/db/queries/workout";

import { Entypo, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderRow = { type: "header"; dateCount: number };
type SectionRow = {
  type: "section";
  workoutId?: number;
  isCurrentLift?: boolean;
  title: string;
  week: string;
  dates: string[];
};
type ExerciseNameRow = {
  type: "exercise-name";
  name: string;
  totalSets: number;
  reps: string;
  description: string;
  colCount: number;
};
type SetRow = { type: "set"; setNumber: number; weights: (number | null)[] };
type TableRow = HeaderRow | SectionRow | ExerciseNameRow | SetRow;

interface LogExercise {
  name: string;
  totalSets: number;
  reps: string;
  description: string;
  /** setWeights[setIndex][dateColIndex] */
  setWeights: (number | null)[][];
}

interface LogSection {
  workoutId?: number;
  isCurrentLift?: boolean;
  title: string;
  week: string;
  exercises: LogExercise[];
  /** Formatted display dates for this workout's columns */
  dates: string[];
}

const COL_WORKOUT = 140;
const COL_SETS = 56;
const COL_REPS = 52;
const COL_DESC = 200;
const COL_WEIGHT = 88;

/** Persistent scroll state across tab navigations */
let savedScrollX = 0;
let savedScrollY = 0;
let lastAutoScrolledWorkoutId: number | null = null;

/** Convert a UTC ISO string to a local YYYY-MM-DD date key */
function localDateKey(isoString: string): string {
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${Number.parseInt(month)}/${Number.parseInt(day)}/${year.slice(2)}`;
}

const MAX_SESSION_COLS = 4;

const buildRows = (sections: LogSection[], globalColCount: number): TableRow[] => {
  const rows: TableRow[] = [{ type: "header", dateCount: globalColCount }];

  for (const section of sections) {
    const pad = Math.max(0, globalColCount - section.dates.length);
    const paddedDates = [...section.dates, ...new Array<string>(pad).fill("")];
    rows.push({
      type: "section",
      workoutId: section.workoutId,
      isCurrentLift: section.isCurrentLift,
      title: section.title,
      week: section.week,
      dates: paddedDates,
    });
    for (const exercise of section.exercises) {
      rows.push({
        type: "exercise-name",
        name: exercise.name,
        totalSets: exercise.totalSets,
        reps: exercise.reps,
        description: exercise.description,
        colCount: globalColCount,
      });
      for (let i = 0; i < exercise.setWeights.length; i++) {
        const wPad = Math.max(0, globalColCount - exercise.setWeights[i].length);
        const paddedWeights = [...exercise.setWeights[i], ...new Array<null>(wPad).fill(null)];
        rows.push({ type: "set", setNumber: i + 1, weights: paddedWeights });
      }
    }
  }
  return rows;
};

interface SessionCluster {
  sessionKey: string;
  displayDate: string;
  timestamp: number;
  byExercise: Record<number, { id: number; weight: number | null }[]>;
}

function clusterWorkoutEntries(
  exercises: { id: number }[],
  allEntries: { exerciseId: number; id: number; weight: number | null; loggedAt: string }[],
): SessionCluster[] {
  const exIdSet = new Set(exercises.map((e) => e.id));
  const workoutEntries = allEntries.filter((e) => exIdSet.has(e.exerciseId));

  if (workoutEntries.length === 0) return [];

  workoutEntries.sort((a, b) => {
    const timeA = new Date(a.loggedAt).getTime();
    const timeB = new Date(b.loggedAt).getTime();
    if (timeB !== timeA) return timeB - timeA;
    return b.id - a.id;
  });

  const SESSION_WINDOW_MS = 2 * 60 * 60 * 1000;
  const sessions: SessionCluster[] = [];

  for (const entry of workoutEntries) {
    const entryTime = new Date(entry.loggedAt).getTime();
    const lastSession = sessions[sessions.length - 1];
    
    let session: SessionCluster | undefined = lastSession && Math.abs(lastSession.timestamp - entryTime) <= SESSION_WINDOW_MS ? lastSession : undefined;

    if (!session) {
      const dateKey = localDateKey(entry.loggedAt);
      session = {
        sessionKey: `session_${entry.id}_${entryTime}`,
        displayDate: formatDate(dateKey),
        timestamp: entryTime,
        byExercise: {},
      };
      sessions.push(session);
    }

    if (!session.byExercise[entry.exerciseId]) {
      session.byExercise[entry.exerciseId] = [];
    }
    session.byExercise[entry.exerciseId].push({ id: entry.id, weight: entry.weight });
  }

  for (const s of sessions) {
    for (const exId of Object.keys(s.byExercise)) {
      s.byExercise[Number(exId)].sort((a, b) => a.id - b.id);
    }
  }

  sessions.sort((a, b) => b.timestamp - a.timestamp);

  return sessions;
}

function getInProgressSetArray(
  exId: number,
  exerciseWeights: Record<number, Record<number, number>>,
): number[] {
  return Object.entries(exerciseWeights[exId] ?? {})
    .map(([k, v]) => ({ setNum: Number(k), weight: v }))
    .sort((a, b) => a.setNum - b.setNum)
    .map((s) => s.weight);
}

async function loadWorkoutsWithExercises(
  workouts: Awaited<ReturnType<typeof getWorkoutsByProgram>>,
) {
  return Promise.all(
    workouts.map(async (w: { id: number }) => ({ workout: w, exercises: await getExercisesByWorkout(w.id) })),
  );
}

function buildWorkoutSection(
  workout: { id: number; title: string; week: number | null },
  exercises: { id: number; name: string; sets: number | null; reps: number | null; description: string | null }[],
  allEntries: { exerciseId: number; id: number; weight: number | null; loggedAt: string }[],
  activeWorkoutId: number | null,
  isInProgress: boolean,
  exerciseWeights: Record<number, Record<number, number>>,
): LogSection {
  const workoutSessions = clusterWorkoutEntries(exercises, allEntries);
  const recentSessions = workoutSessions.slice(0, MAX_SESSION_COLS);

  const isThisActive = workout.id === activeWorkoutId && isInProgress;

  const displayDates: string[] = [];
  if (isThisActive) displayDates.push("Now");
  for (const s of recentSessions) displayDates.push(s.displayDate);

  const logExercises = exercises.map((ex) => {
    const inProgressSets = isThisActive ? getInProgressSetArray(ex.id, exerciseWeights) : [];
    const maxSets = Math.max(
      isThisActive ? inProgressSets.length : 0,
      ...recentSessions.map((s) => s.byExercise[ex.id]?.length ?? 0),
    );

    const setWeights: (number | null)[][] = [];
    for (let setIdx = 0; setIdx < maxSets; setIdx++) {
      const row: (number | null)[] = [];
      if (isThisActive) {
        row.push(inProgressSets[setIdx] ?? null);
      }
      for (const session of recentSessions) {
        row.push(session.byExercise[ex.id]?.[setIdx]?.weight ?? null);
      }
      setWeights.push(row);
    }

    return {
      name: ex.name,
      totalSets: Math.max(ex.sets ?? 1, maxSets),
      reps: ex.reps != null ? String(ex.reps) : "",
      description: ex.description ?? "",
      setWeights,
    };
  });

  return {
    workoutId: workout.id,
    isCurrentLift: isThisActive,
    title: workout.title,
    week: workout.week != null ? `Week ${workout.week}` : "",
    exercises: logExercises,
    dates: displayDates,
  };
}

export default function Logs() {
  const isFocused = useIsFocused();

  const {
    programId: activeProgramId,
    workoutId: activeWorkoutId,
    exerciseWeights,
    isWorkoutSaved,
  } = useActiveWorkout();

  const [allPrograms, setAllPrograms] = useState<{ id: number; name: string }[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [programName, setProgramName] = useState<string | null>(null);
  const [sections, setSections] = useState<LogSection[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [isProgramModalVisible, setIsProgramModalVisible] = useState(false);

  const isInitialLoadRef = useRef(true);
  const flashListRef = useRef<any>(null);
  const headerScrollRef = useRef<ScrollView>(null);
  const listScrollRef = useRef<ScrollView>(null);

  const isInProgress =
    activeWorkoutId !== null && !isWorkoutSaved && Object.keys(exerciseWeights).length > 0;

  useFocusEffect(
    useCallback(() => {
      // Lock orientation to all
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.ALL,
      ).catch(() => { });

      return () => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        ).catch(() => { });
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const loadData = async () => {
        if (isInitialLoadRef.current) {
          setIsInitialLoading(true);
        }
        try {
          const progs = await getPrograms();
          if (cancelled) return;
          setAllPrograms(progs);

          let targetId: number | null = null;
          if (activeProgramId !== null && isInProgress) {
            targetId = activeProgramId;
          } else if (selectedProgramId !== null && progs.some((p: any) => p.id === selectedProgramId)) {
            targetId = selectedProgramId;
          } else if (progs.length > 0) {
            targetId = progs[0].id;
          }

          if (targetId === null) {
            setProgramName(null);
            setSections([]);
            return;
          }

          setSelectedProgramId(targetId);

          const program = getProgramById(targetId);
          const workouts = await getWorkoutsByProgram(targetId);
          if (cancelled) return;

          const workoutsWithExercises = await loadWorkoutsWithExercises(workouts);
          if (cancelled) return;

          const allExIds: number[] = [];
          for (const { exercises } of workoutsWithExercises) {
            for (const ex of exercises) allExIds.push(ex.id);
          }
          const allEntries = await getWeightEntriesByExercises(allExIds);
          if (cancelled) return;

          const isSelectedProgramActive = targetId === activeProgramId && isInProgress;

          const logSections = workoutsWithExercises.map(({ workout, exercises }) =>
            buildWorkoutSection(
              workout,
              exercises,
              allEntries,
              isSelectedProgramActive ? activeWorkoutId : null,
              isSelectedProgramActive,
              exerciseWeights,
            ),
          );

          setProgramName(program?.name ?? "Program");
          setSections(logSections);
        } catch (err) {
          console.error("Error loading logs data:", err);
        } finally {
          if (!cancelled) {
            setIsInitialLoading(false);
            isInitialLoadRef.current = false;
          }
        }
      };

      loadData();
      return () => {
        cancelled = true;
      };
    }, [activeProgramId, activeWorkoutId, isInProgress, exerciseWeights, selectedProgramId]),
  );

  const globalColCount =
    sections.length > 0 ? Math.max(...sections.map((s) => s.dates.length)) : 0;
  const rows = buildRows(sections, globalColCount);
  const descriptionWidth = showDescription ? COL_DESC : 0;
  const tableWidth =
    COL_WORKOUT +
    COL_SETS +
    COL_REPS +
    descriptionWidth +
    COL_WEIGHT * globalColCount;

  // Handle autoscrolling to active lift or restoring scroll position
  React.useEffect(() => {
    if (!isFocused || isInitialLoading || rows.length === 0) return;

    if (isInProgress && activeWorkoutId !== null) {
      if (lastAutoScrolledWorkoutId !== activeWorkoutId) {
        const targetIndex = rows.findIndex(
          (r) => r.type === "section" && r.workoutId === activeWorkoutId,
        );
        if (targetIndex !== -1) {
          lastAutoScrolledWorkoutId = activeWorkoutId;
          const timer = setTimeout(() => {
            flashListRef.current?.scrollToIndex({
              index: targetIndex,
              animated: true,
            });
          }, 100);
          return () => clearTimeout(timer);
        }
      }
    }

    // Restore saved scroll position if set
    if (savedScrollX > 0) {
      listScrollRef.current?.scrollTo({ x: savedScrollX, animated: false });
    }
    if (savedScrollY > 0) {
      flashListRef.current?.scrollToOffset({ offset: savedScrollY, animated: false });
    }
  }, [isFocused, isInitialLoading, rows, isInProgress, activeWorkoutId]);

  const syncScroll = (x: number, source: "header" | "list") => {
    if (source === "list") {
      headerScrollRef.current?.scrollTo({ x, animated: false });
    } else {
      listScrollRef.current?.scrollTo({ x, animated: false });
    }
  };

  const renderRow = ({ item }: { item: TableRow }) => {
    if (item.type === "header") {
      return (
        <View style={[styles.row, styles.headerRow]}>
          <TblCell width={COL_WORKOUT} header align="center">
            Workout
          </TblCell>
          <TblCell width={COL_SETS} header align="center">
            Sets
          </TblCell>
          <TblCell width={COL_REPS} header align="center">
            Reps
          </TblCell>
          {showDescription ? (
            <TblCell width={COL_DESC} header align="center">
              Description
            </TblCell>
          ) : null}
          {Array.from({ length: item.dateCount }, (_, idx) => (
            <TblCell key={idx} width={COL_WEIGHT} header align="center">
              {item.dateCount - idx}
            </TblCell>
          ))}
        </View>
      );
    }

    if (item.type === "section") {
      return (
        <View style={[styles.row, styles.sectionRow]}>
          <TblCell width={COL_WORKOUT} section>
            {item.title}
          </TblCell>
          <View
            style={[
              styles.cell,
              styles.sectionCell,
              { width: COL_SETS + COL_REPS + descriptionWidth },
            ]}
          >
            <Text
              style={[
                styles.cellText,
                styles.sectionText,
                { textAlign: "center" },
              ]}
            >
              {item.week}
            </Text>
          </View>
          {item.dates.map((dt, idx) => (
            <TblCell
              key={`dt_${idx}`}
              width={COL_WEIGHT}
              section
              align="center"
            >
              {dt}
            </TblCell>
          ))}
        </View>
      );
    }

    if (item.type === "exercise-name") {
      return (
        <View style={[styles.row, styles.exerciseRow]}>
          <TblCell width={COL_WORKOUT} bold>
            {item.name}
          </TblCell>
          <TblCell width={COL_SETS} align="center">
            {String(item.totalSets)}
          </TblCell>
          <TblCell width={COL_REPS} align="center">
            {item.reps}
          </TblCell>
          {showDescription ? (
            <TblCell width={COL_DESC} small>
              {item.description}
            </TblCell>
          ) : null}
          {Array.from({ length: item.colCount }, (_, i) => (
            <TblCell key={i} width={COL_WEIGHT} align="center">{""}</TblCell>
          ))}
        </View>
      );
    }

    if (item.type === "set") {
      return (
        <View style={[styles.row, styles.exerciseRow]}>
          <TblCell width={COL_WORKOUT} align="center">{""}</TblCell>
          <TblCell width={COL_SETS} align="center">
            {String(item.setNumber)}
          </TblCell>
          <TblCell width={COL_REPS} align="center">{""}</TblCell>
          {showDescription ? <TblCell width={COL_DESC} align="center">{""}</TblCell> : null}
          {item.weights.map((weight, idx) => (
            <TblCell key={idx} width={COL_WEIGHT} align="center" weightValue>
              {weight != null ? String(weight) : ""}
            </TblCell>
          ))}
        </View>
      );
    }

    return null;
  };

  const renderBody = () => {
    if (isInitialLoading) {
      return (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          color="#f5f5f5"
          size="large"
        />
      );
    }
    if (allPrograms.length === 0) {
      return (
        <View style={{ flex: 1, alignItems: "center", paddingTop: 60 }}>
          <Text style={[styles.titleText, { color: "#f5f5f5" }]}>No programs available</Text>
        </View>
      );
    }
    if (sections.length === 0) {
      return (
        <View style={{ flex: 1, alignItems: "center", paddingTop: 60 }}>
          <Text style={[styles.titleText, { color: "#f5f5f5" }]}>No workouts in this program</Text>
        </View>
      );
    }
    return (
      <ScrollView
        ref={listScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          savedScrollX = x;
          syncScroll(x, "list");
        }}
        scrollEventThrottle={16}
      >
        <View style={{ width: tableWidth, flex: 1 }}>
          <FlashList
            ref={flashListRef}
            data={rows}
            renderItem={renderRow}
            keyExtractor={(_, idx) => String(idx)}
            getItemType={(item) => item.type}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => {
              savedScrollY = e.nativeEvent.contentOffset.y;
            }}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.screen}>
      {isFocused ? <StatusBar style="dark" backgroundColor="#f6a800" /> : null}
      <SafeAreaView edges={["top"]} style={styles.statusBarArea} />
      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.screenBody}>
        <Modal
          visible={isProgramModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setIsProgramModalVisible(false)}
        >
          <View style={modalStyles.backdrop}>
            <Pressable
              style={modalStyles.backdropPressable}
              onPress={() => setIsProgramModalVisible(false)}
            />
            <View style={modalStyles.sheet}>
              <View style={modalStyles.sheetHeader}>
                <Text style={modalStyles.sheetTitle}>Select Program</Text>
                <Pressable onPress={() => setIsProgramModalVisible(false)} hitSlop={20}>
                  <Text style={modalStyles.closeText}>X</Text>
                </Pressable>
              </View>
              <FlatList
                data={allPrograms}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => {
                  const isSelected = item.id === selectedProgramId;
                  return (
                    <Pressable
                      style={[
                        modalStyles.itemButton,
                        isSelected && { borderColor: "#f6a800", borderWidth: 2 },
                      ]}
                      onPress={() => {
                        setSelectedProgramId(item.id);
                        savedScrollX = 0;
                        savedScrollY = 0;
                        lastAutoScrolledWorkoutId = null;
                        setIsProgramModalVisible(false);
                      }}
                    >
                      <Text style={[modalStyles.itemTitle, isSelected && { color: "#f6a800" }]}>
                        {item.name}
                      </Text>
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <Text style={modalStyles.emptyText}>
                    No programs found.
                  </Text>
                }
              />
            </View>
          </View>
        </Modal>

        <View style={styles.titleBar}>
          <View style={styles.titleRow}>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center", flexShrink: 1, paddingRight: 8 }}
              onPress={() => setIsProgramModalVisible(true)}
            >
              <Text
                style={styles.titleText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {programName ?? "Select Program"}
              </Text>
              <Entypo name="chevron-small-down" size={28} color="#0a0a0a" style={{ marginLeft: 2 }} />
            </Pressable>
            <Pressable
              style={styles.toggleButton}
              onPress={() => setShowDescription((prev) => !prev)}
            >
              <Text style={styles.toggleButtonText}>
                <Ionicons
                  name={showDescription ? "eye-outline" : "eye-off-outline"}
                  size={20}
                />
                {" Desc"}
              </Text>
            </Pressable>
          </View>
        </View>
        {renderBody()}
        <View style={{ height: 60 }} />
      </SafeAreaView>
    </View>
  );
}
