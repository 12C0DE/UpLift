import { LogsStyles as styles } from "@/assets";
import { TblCell } from "@/components";
import { mockData } from "@/data/mockProgramData";
import { FlashList } from "@shopify/flash-list";
import React, { useRef } from "react";
import { ScrollView, Text, View } from "react-native";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description: string;
  weights: (number | null)[];
}

interface WorkoutSection {
  title: string;
  week: string;
  exercises: Exercise[];
}

interface WorkoutLogProps {
  programName: string;
  dates: string[];
  sections: WorkoutSection[];
}

type HeaderRow = { type: "header" };
type SectionRow = {
  type: "section";
  title: string;
  week: string;
  dateCount: number;
};
type ExerciseRow = { type: "exercise"; exercise: Exercise };
type TableRow = HeaderRow | SectionRow | ExerciseRow;

const COL_WORKOUT = 140;
const COL_SETS = 56;
const COL_REPS = 80;
const COL_DESC = 200;
const COL_WEIGHT = 88;

const buildRows = (
  sections: WorkoutSection[],
  dateCount: number,
): TableRow[] => {
  const rows: TableRow[] = [{ type: "header" }];

  for (const section of sections) {
    rows.push({
      type: "section",
      title: section.title,
      week: section.week,
      dateCount,
    });

    for (const exercise of section.exercises) {
      rows.push({
        type: "exercise",
        exercise,
      });
    }
  }
  return rows;
};

export default function Logs({
  programName = mockData.programName,
  dates = mockData.dates,
  sections = mockData.sections,
}: WorkoutLogProps) {
  const rows = buildRows(sections, dates.length);
  const tableWidth =
    COL_WORKOUT + COL_SETS + COL_REPS + COL_DESC + COL_WEIGHT * dates.length;

  const headerScrollRef = useRef<ScrollView>(null);
  const listScrollRef = useRef<ScrollView>(null);

  const syncScroll = (x: number, source: "header" | "list") => {
    switch (source) {
      case "list":
        headerScrollRef.current?.scrollTo({ x, animated: false });
        break;
      case "header":
        listScrollRef.current?.scrollTo({ x, animated: false });
        break;
      default:
        break;
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
          <TblCell width={COL_DESC} header align="center">
            Description
          </TblCell>
          {dates.map((_, idx) => (
            <TblCell key={idx} width={COL_WEIGHT} header align="center">
              {dates.length - idx}
            </TblCell>
          ))}
        </View>
      );
    }

    if (item.type === "section") {
      const remainingWidth =
        COL_SETS + COL_REPS + COL_DESC + COL_WEIGHT * item.dateCount;
      return (
        <View style={[styles.row, styles.sectionRow]}>
          <TblCell width={COL_WORKOUT} section>
            {item.title}
          </TblCell>
          <View
            style={[
              styles.cell,
              styles.sectionCell,
              { width: COL_SETS + COL_REPS + COL_DESC },
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
          {dates.map((dt, idx) => (
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

    if (item.type === "exercise") {
      const { exercise } = item;
      return (
        <View style={[styles.row, styles.exerciseRow]}>
          <TblCell width={COL_WORKOUT} bold>
            {exercise.name}
          </TblCell>
          <TblCell width={COL_SETS} align="center">
            {String(exercise.sets)}
          </TblCell>
          <TblCell width={COL_REPS} align="center">
            {exercise.reps}
          </TblCell>
          <TblCell width={COL_DESC} small>
            {exercise.description}
          </TblCell>
          {exercise.weights.map((weight, idx) => (
            <TblCell key={idx} width={COL_WEIGHT} align="center" weightValue>
              {weight != null ? String(weight) : ""}
            </TblCell>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>{programName}</Text>
      </View>
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
            // estimatedItemSize={52}
            keyExtractor={(_, idx) => String(idx)}
            getItemType={(item) => item.type}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      <Text>Logs</Text>
    </View>
  );
}
