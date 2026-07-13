import { currentLiftStyles as styles } from "@/assets";
import { BarbellDisplay, WeightPlate } from "@/components";
import { getWorkoutsByProgram } from "@/db/queries/workout";
import { BAR_WEIGHT, WEIGHT_LIST } from "@/utils";
import Entypo from "@expo/vector-icons/Entypo";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CurrentLiftProps {
  liftName: string;
  desc: string;
  lastWeight?: number;
  totalSets: number;
  reps?: number;
}

interface SetType {
  totalSets: number;
  currentSet: number;
}

interface ProgramOption {
  id: number;
  name: string;
  totalWorkouts?: number;
  lastWorkout?: string;
}

type WorkoutOption = Awaited<ReturnType<typeof getWorkoutsByProgram>>[number];

const firstParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export default function CurrentLift({
  liftName = "Bench",
  desc = "Lay on a flat bench and press barbell to your chest and back up.",
  lastWeight = 0,
  totalSets = 3,
  reps = 5,
}: CurrentLiftProps) {
  const params = useLocalSearchParams<{
    start?: string | string[];
    programId?: string | string[];
    workoutId?: string | string[];
    workoutTitle?: string | string[];
    workoutSummary?: string | string[];
  }>();
  const startParam = firstParam(params.start);
  const programIdParam = firstParam(params.programId);
  const workoutTitleParam = firstParam(params.workoutTitle);
  const workoutSummaryParam = firstParam(params.workoutSummary);

  const activeLiftName = workoutTitleParam ?? liftName;
  const activeLiftDescription = workoutSummaryParam ?? desc;

  const [totalWeight, setTotalWeight] = useState(lastWeight || 0);
  const [sets, setSets] = useState<SetType>({
    totalSets,
    currentSet: 1,
  });
  const [isStartModalVisible, setIsStartModalVisible] = useState(
    Boolean(startParam),
  );
  const [workouts, setWorkouts] = useState<WorkoutOption[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    programIdParam ? Number(programIdParam) : null,
  );
  const [isLoadingStartData, setIsLoadingStartData] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    setIsStartModalVisible(Boolean(startParam));
    setSelectedProgramId(programIdParam ? Number(programIdParam) : null);
  }, [programIdParam, startParam]);

  useEffect(() => {
    if (!isStartModalVisible) return;

    let isActive = true;

    const loadStartData = async () => {
      setIsLoadingStartData(true);
      setStartError(null);

      try {
        if (!selectedProgramId) {
          setWorkouts([]);
          setStartError("Open a program to choose a workout.");
          return;
        }

        {
          const programWorkouts = await getWorkoutsByProgram(selectedProgramId);
          if (!isActive) return;
          setWorkouts(programWorkouts);
        }
      } catch (error) {
        if (!isActive) return;
        setStartError("Unable to load workouts.");
        console.error("Error loading start modal data:", error);
      } finally {
        if (isActive) setIsLoadingStartData(false);
      }
    };

    loadStartData();

    return () => {
      isActive = false;
    };
  }, [isStartModalVisible, selectedProgramId]);

  const calculatePlates = (weight: number): number[] => {
    const weightsPerSide = (weight - BAR_WEIGHT) / 2;
    const plates: number[] = [];
    let remaining = weightsPerSide;

    for (const plate of WEIGHT_LIST.toReversed()) {
      while (remaining >= plate) {
        plates.push(plate);
        remaining -= plate;
      }
    }

    return plates;
  };

  const plates = calculatePlates(totalWeight);
  const topRowWeights = WEIGHT_LIST.toReversed().slice(0, 3);
  const bottomRowWeights = WEIGHT_LIST.toReversed().slice(3);

  const weightChangeTextHandler = (text: string) => {
    const numericValue = parseFloat(text);

    if (numericValue >= 1999) return;

    if (isNaN(numericValue) || numericValue < 0) {
      setTotalWeight(0);
      return;
    } else {
      setTotalWeight(numericValue);
    }
  };

  const weightChangeHandler = (
    weightToAdd: number,
    direction: "up" | "down",
  ) => {
    const change = direction === "up" ? weightToAdd : -weightToAdd;
    const newWeight = totalWeight + change;
    if (newWeight >= 0 && newWeight <= 1000) {
      setTotalWeight(newWeight);
    }
  };

  const closeStartModal = () => {
    setIsStartModalVisible(false);
    router.replace("/currentlift" as any);
  };

  const selectWorkout = async (workout: WorkoutOption) => {
    setIsStartModalVisible(false);
    router.replace({
      pathname: "/currentlift" as any,
      params: {
        workoutId: String(workout.id),
        workoutTitle: workout.title,
        workoutSummary: workout.exercises?.length
          ? workout.exercises.join(" • ")
          : workout.title,
      },
    });
  };

  const modalBody = (
    <FlatList
      data={workouts}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Pressable style={modalStyles.itemButton} onPress={() => selectWorkout(item)}>
          <Text style={modalStyles.itemTitle}>{item.title}</Text>
          <Text style={modalStyles.itemSubtitle}>
            {item.exercises?.length
              ? `${item.exercises.length} exercises`
              : "Tap to start"}
          </Text>
        </Pressable>
      )}
      ListEmptyComponent={
        <Text style={modalStyles.emptyText}>No workouts found for this program.</Text>
      }
    />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={styles.container}>
      <Modal
        visible={isStartModalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeStartModal}
      >
        <View style={modalStyles.backdrop}>
          <Pressable style={modalStyles.backdropPressable} onPress={closeStartModal} />
          <View style={modalStyles.sheet}>
            <View style={modalStyles.sheetHeader}>
              <Text style={modalStyles.sheetTitle}>Choose Workout</Text>
              <Pressable onPress={closeStartModal} hitSlop={20}>
                <Text style={modalStyles.closeText}>X</Text>
              </Pressable>
            </View>

            {startError ? <Text style={modalStyles.errorText}>{startError}</Text> : null}

            {isLoadingStartData ? (
              <ActivityIndicator color="#f5f5f5" size="large" />
            ) : (
              modalBody
            )}
          </View>
        </View>
      </Modal>
      <View>
        <View>
          <View style={styles.header}>
            <View style={{ flex: 1 }} />
            <Text style={styles.exerciseName}>{activeLiftName}</Text>
            <View style={{ flex: 1}}>
              <Pressable
                style={styles.descButton}
                hitSlop={24}
                onPress={() =>
                  router.push({
                    pathname: "/descriptionModal" as any,
                    params: {
                      title: activeLiftName,
                      description: activeLiftDescription,
                    },
                  })
                }
              >
                <Entypo name="info-with-circle" size={18} color="#929292" />
              </Pressable>
            </View>
          </View>
          <View style={styles.weightSection}>
            <BarbellDisplay
              plates={plates}
              totalWeight={totalWeight}
              weightChangeHandler={weightChangeTextHandler}
            />
            <Text style={styles.lastLift}>
              {lastWeight ? `Last: ${lastWeight} lbs` : null}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.weightsStack}>
            <View style={styles.weightsRow}>
              {topRowWeights.map((weight) => (
                <WeightPlate
                  key={`w_${weight}`}
                  weight={weight}
                  onSwipeDown={() => weightChangeHandler(weight, "down")}
                  onSwipeUp={() => weightChangeHandler(weight, "up")}
                />
              ))}
            </View>
            <View style={styles.weightsRow}>
              {bottomRowWeights.map((weight) => (
                <WeightPlate
                  key={`w_${weight}`}
                  weight={weight}
                  onSwipeDown={() => weightChangeHandler(weight, "down")}
                  onSwipeUp={() => weightChangeHandler(weight, "up")}
                />
              ))}
            </View>
          </View>
          <Text style={styles.swipeHint}>Swipe up or down to change weight</Text>
        </View>
        <View style={styles.setsRepsSection}>
          <View style={styles.setsContainer}>
            <Text style={styles.sectionLabel}>Sets</Text>
            <View style={styles.setsRow}>
              <View style={styles.numberBox}>
                <Text style={styles.numberText}>{sets.currentSet}</Text>
              </View>
              <Text style={styles.ofText}>of</Text>
              <View style={styles.numberBox}>
                <Text style={styles.numberText}>{totalSets}</Text>
              </View>
            </View>
          </View>
          <View style={styles.repsContainer}>
            <Text style={styles.sectionLabel}>Reps</Text>
            <View style={[styles.numberBox, styles.numberBoxCentered]}>
              <Text style={styles.numberText}>{reps}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.navContainer}>
        <Pressable
          hitSlop={24}
          style={styles.navButton}
          onPress={() => {
            if (sets.currentSet > 1) {
              setSets({ ...sets, currentSet: sets.currentSet - 1 });
            } else {
              console.log("Previous exercise");
            }
          }}
        >
          {sets.currentSet === 1 ? (
              <Text style={styles.nextLiftText}>Prev Lift</Text>
          ) : (
            <Entypo name="arrow-bold-left" size={42} color="white" />
          )}
        </Pressable>
        <Pressable
          hitSlop={24}
          style={styles.navButton}
          onPress={() => {
            if (sets.currentSet < totalSets) {
              setSets({ ...sets, currentSet: sets.currentSet + 1 });
            } else {
              console.log("Next exercise");
            }
          }}
        >
          {sets.currentSet < totalSets ? (
            <Entypo name="arrow-bold-right" size={42} color="white" />
          ) : (
            <Text style={styles.nextLiftText}>Next Lift</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "flex-start",
    paddingVertical: 100,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: "#121212",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2f2f2f",
    padding: 20,
    maxHeight: "80%",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sheetTitle: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#f5f5f5",
    letterSpacing: 0.8,
  },
  closeText: {
    color: "#9a9a9a",
    fontSize: 14,
  },
  sectionLabel: {
    color: "#d6d6d6",
    fontSize: 14,
    marginBottom: 12,
  },
  itemButton: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  itemTitle: {
    color: "#f5f5f5",
    fontFamily: "BebasNeue",
    fontSize: 26,
    letterSpacing: 0.6,
  },
  itemSubtitle: {
    color: "#9a9a9a",
    fontSize: 13,
    marginTop: 4,
  },
  emptyText: {
    color: "#9a9a9a",
    textAlign: "center",
    marginTop: 16,
  },
  errorText: {
    color: "#ff8a8a",
    marginBottom: 12,
  },
});
