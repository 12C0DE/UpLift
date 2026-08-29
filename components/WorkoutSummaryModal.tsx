import { currentLiftModalStyles as modalStyles, workoutSummaryModalStyles as styles } from "@/assets";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

export interface WorkoutSummaryData {
  durationSeconds: number;
  exercisesWithWeightCount: number;
  totalExercisesCount: number;
  totalVolume: number;
  maxWeight: number;
  maxWeightExerciseName: string;
}

interface WorkoutSummaryModalProps {
  visible: boolean;
  onReturnHome: () => void;
  summaryData: WorkoutSummaryData | null;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  visible,
  onReturnHome,
  summaryData,
}) => {
  if (!summaryData) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onReturnHome}
    >
      <View style={modalStyles.backdrop}>
        <View style={styles.container}>
          {/* Header Banner */}
          <View style={styles.header}>
            <View style={styles.trophyCircle}>
              <Entypo name="trophy" size={32} color="#f6a800" />
            </View>
            <Text style={styles.title}>Workout Complete!</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Stat Item 1: Duration */}
            <View style={styles.statCard}>
              <View style={styles.iconBox}>
                <Entypo name="stopwatch" size={20} color="#f6a800" />
              </View>
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>Time Elapsed</Text>
                <Text style={styles.statValue}>
                  {formatDuration(summaryData.durationSeconds)}
                </Text>
              </View>
            </View>

            {/* Stat Item 2: Lifts > 0 lbs */}
            <View style={styles.statCard}>
              <View style={styles.iconBox}>
                <Entypo name="controller-record" size={20} color="#4cd964" />
              </View>
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>Lifts (&gt; 0 lbs)</Text>
                <Text style={styles.statValue}>
                  {summaryData.exercisesWithWeightCount} / {summaryData.totalExercisesCount}
                </Text>
              </View>
            </View>

            {/* Stat Item 3: Total Volume */}
            <View style={styles.statCard}>
              <View style={styles.iconBox}>
                <Entypo name="flash" size={20} color="#ff9500" />
              </View>
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>Total Volume</Text>
                <Text style={styles.statValue}>
                  {summaryData.totalVolume.toLocaleString()} lbs
                </Text>
              </View>
            </View>

            {/* Stat Item 4: Top Weight */}
            {summaryData.maxWeight > 0 && (
              <View style={styles.statCard}>
                <View style={styles.iconBox}>
                  <Entypo name="star" size={20} color="#ffcc00" />
                </View>
                <View style={styles.statTextGroup}>
                  <Text style={styles.statLabel}>Heaviest Lift</Text>
                  <Text style={styles.statValue}>
                    {summaryData.maxWeight} lbs
                  </Text>
                  {summaryData.maxWeightExerciseName ? (
                    <Text style={styles.statSubText} numberOfLines={1}>
                      {summaryData.maxWeightExerciseName}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
          </View>

          {/* Action Button */}
          <Pressable style={styles.homeBtn} onPress={onReturnHome}>
            <Text style={styles.homeBtnText}>Return to Home</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};


