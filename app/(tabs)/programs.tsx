import { ProgramsStylesheet as styles } from "@/assets";
import { mockProgramSimpleData as mockData } from "@/data";
import { getPrograms } from "@/db/queries/programs";
import Entypo from "@expo/vector-icons/Entypo";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Program {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  lastWorkout?: string;
}

interface ProgramsPageProps {
  programs: Program[];
  onCreateProgram: () => void;
  onSelectProgram: (programId: string) => void;
  onBack: () => void;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [ isError, setIsError ] = useState(false);

  useEffect(() =>{
    const fetchPrograms = async () => {
      try {
        const programsData = await getPrograms();
        setPrograms(programsData);
      } catch (error) {
        setIsError(true);
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load programs. Please try again later.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
    {/* <View style={styles.container}> */}
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
      </View>
      <Pressable style={styles.addButton}>
        <View style={styles.addLayout}>
          <View style={styles.rowLayout}>
            <Entypo name="plus" size={36} color="black" />
            <Text style={styles.addText}>Create New Program</Text>
          </View>
        </View>
      </Pressable>
      <Text style={styles.headerText}>Your Programs</Text>
      <View style={{height: "65%", paddingBottom: 48}}>
      <FlatList
        data={mockData}
        renderItem={({ item }) => (
          <Pressable key={item.id} style={styles.progButton}>
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
    </SafeAreaView>
  );
};

export default Programs;