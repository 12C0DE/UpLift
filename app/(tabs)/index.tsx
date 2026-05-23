import { indexStyles as styles } from "@/assets";
import { getRecentPrograms } from "@/db/queries/programs";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Program } from "./programs";

const MIN_RECENT_PROGRAM_SLOTS = 3;

const Index = () => {
  const [recentPrograms, setRecentPrograms] = useState<Program[]>([]);
  const emptySlotsNeeded = Math.max(
    0,
    MIN_RECENT_PROGRAM_SLOTS - recentPrograms.length
  );
  const recentProgramSlots = [
    ...recentPrograms.map((prog) => ({ key: prog.id, prog })),
    ...Array.from({ length: emptySlotsNeeded }, (_, i) => ({
      key: `empty-slot-${i + 1}`,
      prog: null as Program | null,
    })),
  ];

  useEffect(() => {
    const fetchRecentPrograms = async () => {
      try {
        const programsData = await getRecentPrograms();
        setRecentPrograms(programsData);  
      } catch (error) {
        console.error("Error fetching recent programs:", error);
      }
    };

    fetchRecentPrograms();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Uplift</Text>
      </View>
      <View>
        <Text style={styles.subText}>Recently used</Text>
        {recentProgramSlots.map((slot) => {
          if (!slot.prog) {
            return <View key={slot.key} style={styles.emptyProg} />;
          }

          const prog = slot.prog;

          return (
            <Pressable key={prog.id} style={styles.progButton}>
              <View style={styles.progLayout}>
                <View style={styles.rowLayout}>
                  <Entypo name="controller-play" size={36} color="black" />
                  <Text style={styles.progText}>Start Workout</Text>
                </View>
                <View>
                  <Text style={styles.workoutText}>{`-- ${prog.name} --`}</Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "italicFont",
                      fontSize: 12,
                      fontStyle: "italic",
                    }}
                  >
                    Last lift: {prog.lastWorkout}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.otherButtonsContainer}>
        <Pressable style={styles.otherButton}>
          <View style={styles.otherButtonLayout}>
            <SimpleLineIcons name="notebook" size={24} color="#f5f5f5" />
            <Text style={styles.otherButtonText}>Programs</Text>
          </View>
        </Pressable>
        <Pressable style={styles.otherButton}>
          <View style={styles.otherButtonLayout}>
          <Ionicons name="calendar-outline" size={24} color={"#f5f5f5"} />
          <Text style={styles.otherButtonText}>View Logs</Text>
          </View>
        </Pressable>
      </View>
      <View style={{height: 65}}/>
    </SafeAreaView>
  );
};

export default Index;
