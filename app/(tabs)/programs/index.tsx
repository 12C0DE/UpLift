import { ProgramsStylesheet as styles } from "@/assets";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
// import { mockProgramSimpleData as mockData } from "@/data";
import { getPrograms } from "@/db/queries/programs";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const PROGRAM_SLOTS = 3;

// interface Program {
//   programName: string;
//   sections: WorkoutSection[];
// }

export interface Program {
  id: number;
  name: string;
  createdAt: string;
  modifiedAt: string;
  totalWorkouts?: number;
  lastWorkout?: string;
}

interface ProgramsPageProps {
  programs: Program[];
  onCreateProgram: () => void;
  onSelectProgram: (programId: number) => void;
  onBack: () => void;
}

//* All Programs page
const Programs = () => {
  //TODO: replace recent logic - need to pull program data here
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
  }, []));

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
        {/* <View style={styles.addLayout}> */}
          <View style={styles.rowLayout}>
            <Entypo name="plus" size={36} color="black" />
            <Text style={styles.addText}>Create New Program</Text>
          </View>
        {/* </View> */}
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
              <View style={styles.rowLayout}>
                <View style={styles.colLayout}>
                  <Text style={styles.progText}>{item.name}</Text>
                  <Text style={styles.subText}>
                    {item.totalWorkouts &&
                      `${item.totalWorkouts} workouts logged`}
                  </Text>
                  <Text style={styles.subText}>
                    {item.lastWorkout && `Last workout: ${item.lastWorkout}`}
                  </Text>
                </View>
                <View>
                  <Entypo name="chevron-right" size={32} color="white" />
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

export default Programs;
