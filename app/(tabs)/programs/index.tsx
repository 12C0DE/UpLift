import { ProgramsStylesheet as styles } from "@/assets";
import { getPrograms } from "@/db/queries/programs";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Program {
  id: number;
  name: string;
  createdAt: string;
  modifiedAt: string;
  workoutCount?: number;
  exerciseCount?: number;
  timesCompleted?: number;
  lastWorkout?: string;
  lastWorkoutISO?: string | null;
  workoutTitles?: string[];
  totalWorkouts?: number;
}

interface ProgramsPageProps {
  programs: Program[];
  onCreateProgram: () => void;
  onSelectProgram: (programId: number) => void;
  onBack: () => void;
}

//* All Programs page
const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchRecentPrograms = async () => {
        setIsLoading(true);
        setIsError(false);

        try {
          const programsData = await getPrograms();
          if (!isActive) return;
          setPrograms(programsData);
        } catch (error) {
          if (!isActive) return;
          setIsError(true);
          console.error("Error fetching recent programs:", error);
        } finally {
          if (isActive) setIsLoading(false);
        }

      };
      fetchRecentPrograms();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading programs...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error loading programs. Please try again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
      </View>
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/programs/edit")}
      >
        <View style={styles.rowLayout}>
          <Entypo name="plus" size={32} color="black" />
          <Text style={styles.addText}>Create New Program</Text>
        </View>
      </Pressable>
      <Text style={styles.headerText}>Your Programs</Text>
      <View style={{ height: "65%", paddingBottom: 48 }}>
        <FlatList
          data={programs}
          renderItem={({ item }) => (
            <Pressable
              key={item.id}
              style={styles.progButton}
              onPress={() => router.push(`/programs/edit?id=${item.id}`)}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.progText}>{item.name}</Text>
                <Entypo name="chevron-right" size={24} color="#f6a800" />
              </View>

              {item.workoutTitles && item.workoutTitles.length > 0 && (
                <Text style={styles.workoutPreviewText} numberOfLines={1} ellipsizeMode="tail">
                  {item.workoutTitles.join(" • ")}
                </Text>
              )}

              <View style={styles.cardDivider} />

              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Ionicons name="barbell-outline" size={14} color="#f6a800" />
                  <Text style={styles.metaText}>
                    {item.workoutCount ?? 0} {(item.workoutCount ?? 0) === 1 ? "workout" : "workouts"}
                    {(item.exerciseCount ?? 0) > 0 ? ` (${item.exerciseCount} lifts)` : ""}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons name="repeat-outline" size={14} color="#f6a800" />
                  <Text style={styles.metaText}>
                    {item.timesCompleted ?? 0} {(item.timesCompleted ?? 0) === 1 ? "time completed" : "times completed"}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="#f6a800" />
                  <Text style={styles.metaText}>
                    {item.lastWorkout ?? "Never"}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView >
  );
};

export default Programs;
