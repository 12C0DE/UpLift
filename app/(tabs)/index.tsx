import { Pressable, Text, View } from "react-native";
import { indexStyles as styles } from "@/assets";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import { mockProgramSimpleData as mockPrograms } from "@/data";

const index = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Uplift</Text>
      </View>
      <View>
        <Text style={styles.subText}>Recently used</Text>
        {mockPrograms.slice(0, 3).map((prog) => (
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
        ))}
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
    </View>
  );
};

export default index;
