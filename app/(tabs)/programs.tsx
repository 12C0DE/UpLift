import { ProgramsStylesheet as styles } from "@/assets";
import { WorkoutSection } from "@/types";
import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, Text, View } from "react-native";

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
      <Pressable style={styles.addButton}>
        <View style={styles.progLayout}>
          <View style={styles.rowLayout}>
            <Entypo name="plus" size={36} color="black" />
            <Text style={styles.progText}>Create New Program</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default programs;
