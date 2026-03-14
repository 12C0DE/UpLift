import { ProgramsStylesheet as styles } from "@/assets";
import { mockProgramSimpleData as mockData } from "@/data";
import { WorkoutSection } from "@/types";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

interface Program {
  programName: string;
  sections: WorkoutSection[];
}

interface ProgramsPageProps {
  programs: Program[];
  onCreateProgram: () => void;
  onSelectProgram: (programId: string) => void;
  onBack: () => void;
}

const programs = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
      </View>
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/programs/edit")}
      >
        <View style={styles.addLayout}>
          <View style={styles.rowLayout}>
            <Entypo name="plus" size={36} color="black" />
            <Text style={styles.addText}>Create New Program</Text>
          </View>
        </View>
      </Pressable>
      <Text style={styles.headerText}>Your Programs</Text>
      <View style={{ height: "65%", paddingBottom: 48 }}>
        <FlatList
          data={mockData}
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
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default programs;
