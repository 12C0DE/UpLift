import { ProgramsStylesheet as styles } from "@/assets";
import { getPrograms } from "@/db/queries/programs";
import Entypo from "@expo/vector-icons/Entypo";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Program {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  totalWorkouts?: number;
  lastWorkout?: string;
}

export interface ProgramsPageProps {
  programs: Program[];
  onCreateProgram: () => void;
  onSelectProgram: (programId: string) => void;
  onBack: () => void;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchPrograms = async () => {
        setIsLoading(true);
        setIsError(false);

        try {
          const programsData = await getPrograms();
          if (!isActive) return;
          setPrograms(programsData);
        } catch (error) {
          if (!isActive) return;
          setIsError(true);
          console.error("Error fetching programs:", error);
        } finally {
          if (!isActive) return;
          setIsLoading(false);
        }
      };

      fetchPrograms();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load programs. Please try again later.</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={[styles.subText, { marginTop: 12 }]}>Loading programs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
      </View>
      <Pressable style={styles.addButton}>
        {/* <View style={styles.addLayout}> */}
          <View style={styles.rowLayout}>
            <Entypo name="plus" size={36} color="black" />
            <Text style={styles.addText}>Create New Program</Text>
          {/* </View> */}
        </View>
      </Pressable>
      <View style={{ height: "65%", paddingBottom: 48 }}>
        {programs.length === 0 && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text numberOfLines={2} style={styles.subText}>
              {`No programs found.\nCreate your first program to get started!`}
            </Text>
          </View>
        )}
        <FlatList
          data={programs}
          renderItem={({ item }) => (
            <Pressable key={item.id} style={styles.progButton}>
              <View style={styles.rowLayout}>
                <View style={styles.colLayout}>
                  <Text style={styles.progText}>{item.name}</Text>
                  <Text style={styles.subText}>
                    {Boolean(item.totalWorkouts) &&
                      `${item.totalWorkouts} workouts logged`}
                  </Text>
                  <Text style={styles.subText}>
                    {Boolean(item.lastWorkout) && `Last workout: ${item.lastWorkout}`}
                  </Text>
                </View>
                <View>
                  <Entypo name="chevron-right" size={32} color="white" />
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Programs;