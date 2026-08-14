import { LogsStyles as styles } from "@/assets";
import { TblCell } from "@/components";
import { useActiveWorkout } from "@/context/ActiveWorkoutContext";
import { getExercisesByWorkout } from "@/db/queries/exercises";
import { getProgramById } from "@/db/queries/programs";
import { getWeightEntriesByExercises } from "@/db/queries/weights";
import { getWorkoutsByProgram } from "@/db/queries/workout";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderRow = { type: "header"; dateCount: number };
type SectionRow = { type: "section"; title: string; week: string; dates: string[] };
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
    rows.push({ type: "section", title: section.title, week: section.week, dates: paddedDates });
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

type SetEntry = { id: number; weight: number | null };
type ByExDate = Record<number, Record<string, SetEntry[]>>;

function groupEntriesByExDate(
  allEntries: { exerciseId: number; id: number; weight: number | null; loggedAt: string }[],
  exerciseIds: number[],
): ByExDate {
  const byExDate: ByExDate = {};
  for (const id of exerciseIds) byExDate[id] = {};
  for (const entry of allEntries) {
    const date = localDateKey(entry.loggedAt);
    const bucket = byExDate[entry.exerciseId];
    if (!bucket) continue;
    if (!bucket[date]) bucket[date] = [];
    bucket[date].push({ id: entry.id, weight: entry.weight });
  }
  for (const exId of Object.keys(byExDate)) {
    for (const date of Object.keys(byExDate[Number(exId)])) {
      byExDate[Number(exId)][date].sort((a, b) => a.id - b.id);
    }
  }
  return byExDate;
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

function buildLogExercise(
  ex: { id: number; name: string; sets: number | null; reps: number | null; description: string | null },
  dateCols: string[],
  sortedDates: string[],
  byExDate: ByExDate,
  inProgressSets: number[],
  isInProgress: boolean,
): LogExercise {
  const maxSets = Math.max(
    isInProgress ? inProgressSets.length : 0,
    ...sortedDates.map((d) => byExDate[ex.id]?.[d]?.length ?? 0),
  );

  const setWeights: (number | null)[][] = [];
  for (let s = 0; s < maxSets; s++) {
    const row: (number | null)[] = dateCols.map((col) => {
      if (col === "now") return inProgressSets[s] ?? null;
      return byExDate[ex.id]?.[col]?.[s]?.weight ?? null;
    });
    setWeights.push(row);
  }

  return {
    name: ex.name,
    totalSets: Math.max(ex.sets ?? 1, maxSets),
    reps: ex.reps != null ? String(ex.reps) : "",
    description: ex.description ?? "",
    setWeights,
  };
}


async function loadWorkoutsWithExercises(
  workouts: Awaited<ReturnType<typeof getWorkoutsByProgram>>,
) {
  return Promise.all(
    workouts.map(async (w) => ({ workout: w, exercises: await getExercisesByWorkout(w.id) })),
  );
}

function buildWorkoutSection(
  workout: { id: number; title: string; week: number | null },
  exercises: { id: number; name: string; sets: number | null; reps: number | null; description: string | null }[],
  byExDate: ByExDate,
  activeWorkoutId: number | null,
  isInProgress: boolean,
  exerciseWeights: Record<number, Record<number, number>>,
): LogSection {
  const workoutDates = new Set<string>();
  for (const ex of exercises) {
    for (const d of Object.keys(byExDate[ex.id] ?? {})) workoutDates.add(d);
  }
  const sortedDates = [...workoutDates].sort((a, b) => b.localeCompare(a)).slice(0, MAX_SESSION_COLS);

  const isThisActive = workout.id === activeWorkoutId && isInProgress;
  const dateCols = isThisActive ? ["now", ...sortedDates] : sortedDates;
  const displayDates = dateCols.map((d) => (d === "now" ? "Now" : formatDate(d)));

  const logExercises = exercises.map((ex) =>
    buildLogExercise(
      ex,
      dateCols,
      sortedDates,
      byExDate,
      isThisActive ? getInProgressSetArray(ex.id, exerciseWeights) : [],
      isThisActive,
    ),
  );

  return {
    title: workout.title,
    week: workout.week != null ? `Week ${workout.week}` : "",
    exercises: logExercises,
    dates: displayDates,
  };
}

export default function Logs() {
  const isFocused = useIsFocused();

  const {
    programId,
    workoutId,
    exerciseWeights,
    isWorkoutSaved,
  } = useActiveWorkout();

  const [programName, setProgramName] = useState<string | null>(null);
  const [sections, setSections] = useState<LogSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

  const isInProgress =
    workoutId !== null && !isWorkoutSaved && Object.keys(exerciseWeights).length > 0;

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
      if (!programId) {
        setSections([]);
        setProgramName(null);
        return;
      }

      let cancelled = false;

      const loadData = async () => {
        setIsLoading(true);
        try {
          const program = getProgramById(programId);
          const workouts = await getWorkoutsByProgram(programId);

          if (cancelled) return;

          const workoutsWithExercises = await loadWorkoutsWithExercises(workouts);

          if (cancelled) return;

          const allExIds: number[] = [];
          for (const { exercises } of workoutsWithExercises) {
            for (const ex of exercises) allExIds.push(ex.id);
          }
          const allEntries = await getWeightEntriesByExercises(allExIds);

          if (cancelled) return;

          const byExDate = groupEntriesByExDate(allEntries, allExIds);

          const logSections = workoutsWithExercises.map(({ workout, exercises }) =>
            buildWorkoutSection(workout, exercises, byExDate, workoutId, isInProgress, exerciseWeights),
          );

          setProgramName(program?.name ?? "Program");
          setSections(logSections);
        } catch (err) {
          console.error("Error loading logs data:", err);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };

      loadData();
      return () => {
        cancelled = true;
      };
    }, [programId, workoutId, isInProgress, exerciseWeights]),
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

  const headerScrollRef = useRef<ScrollView>(null);
  const listScrollRef = useRef<ScrollView>(null);

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

  const titleLabel = programName ?? "Logs";

  const renderBody = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          color="#f5f5f5"
          size="large"
        />
      );
    }
    if (!programId) {
      return (
        <View style={{ flex: 1, alignItems: "center", paddingTop: 60 }}>
          <Text style={styles.titleText}>No active workout</Text>
        </View>
      );
    }
    return (
      <ScrollView
        ref={listScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => syncScroll(e.nativeEvent.contentOffset.x, "list")}
        scrollEventThrottle={16}
      >
        <View style={{ width: tableWidth, flex: 1 }}>
          <FlashList
            data={rows}
            renderItem={renderRow}
            keyExtractor={(_, idx) => String(idx)}
            getItemType={(item) => item.type}
            showsVerticalScrollIndicator={false}
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
        <View style={styles.titleBar}>
          <View style={styles.titleRow}>
            <Text
              style={styles.titleText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {titleLabel}
            </Text>
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
