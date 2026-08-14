import { currentLiftModalStyles as modalStyles, currentLiftStyles as styles } from "@/assets";
import { BarbellDisplay, LastLiftContent, WeightPlate, WorkoutMenuModal, WorkoutSummaryData, WorkoutSummaryModal } from "@/components";
import { useActiveWorkout } from "@/context/ActiveWorkoutContext";
import { getExercisesWithLastWeightByWorkout } from "@/db/queries/exercises";
import { logWeight } from "@/db/queries/weights";
import { getWorkoutsByProgram } from "@/db/queries/workout";
import { BAR_WEIGHT, WEIGHT_LIST } from "@/utils";
import Entypo from "@expo/vector-icons/Entypo";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
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

type WorkoutOption = Awaited<ReturnType<typeof getWorkoutsByProgram>>[number];
type ExerciseType = Awaited<ReturnType<typeof getExercisesWithLastWeightByWorkout>>[number];

const firstParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export default function CurrentLift({
  liftName = "",
  desc = "",
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
  const workoutIdParam = firstParam(params.workoutId);

  const { setWorkoutData, updateWeights, markSaved, clearWorkout } = useActiveWorkout();

  const [totalWeight, setTotalWeight] = useState(lastWeight || 0);
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutExercises, setWorkoutExercises] = useState<ExerciseType[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseWeights, setExerciseWeights] = useState<Record<number, Record<number, number>>>({})
  const [isSaving, setIsSaving] = useState(false);
  const [workoutSaved, setWorkoutSaved] = useState(false);
  const [isStartModalVisible, setIsStartModalVisible] = useState(
    Boolean(startParam),
  );
  const [workouts, setWorkouts] = useState<WorkoutOption[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    programIdParam ? Number(programIdParam) : null,
  );
  const [isLoadingStartData, setIsLoadingStartData] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [summaryData, setSummaryData] = useState<WorkoutSummaryData | null>(null);
  const workoutStartTimeRef = useRef<number>(Date.now());

  const currentExercise: ExerciseType | null = workoutExercises[currentExerciseIndex] ?? null;
  const activeLiftName = currentExercise?.name ?? workoutTitleParam ?? liftName;
  const activeLiftDescription = currentExercise?.description ?? workoutSummaryParam ?? desc;
  const activeTotalSets = currentExercise?.sets ?? totalSets;
  const activeReps = currentExercise?.reps ?? reps;

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

  useEffect(() => {
    if (!workoutIdParam) {
      setWorkoutExercises([]);
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      return;
    }

    let isActive = true;

    const loadExercises = async () => {

      try {
        const exercisesData = await getExercisesWithLastWeightByWorkout(Number(workoutIdParam));
        if (!isActive) return;
        setWorkoutExercises(exercisesData);
        setCurrentExerciseIndex(0);
        setCurrentSet(1);
        setWorkoutSaved(false);
        workoutStartTimeRef.current = Date.now();

        const weightMap: Record<number, Record<number, number>> = {};
        exercisesData.forEach((ex) => {
          const lastWt = ex.lastWeight ?? 0;
          const numSets = ex.sets ?? totalSets;
          weightMap[ex.id] = {};
          for (let s = 1; s <= numSets; s++) {
            weightMap[ex.id][s] = lastWt;
          }
        });
        setExerciseWeights(weightMap);

        if (exercisesData.length > 0) {
          setTotalWeight(weightMap[exercisesData[0].id]?.[1] ?? 0);
        }

        setWorkoutData({
          programId: programIdParam ? Number(programIdParam) : null,
          workoutId: Number(workoutIdParam),
          workoutTitle: workoutTitleParam ?? null,
          workoutWeek: null,
          exercises: exercisesData,
          exerciseWeights: weightMap,
        });
      } catch (error) {
        console.error("Error loading exercises:", error);
      } finally {
        // exercises loaded
      }
    };

    loadExercises();

    return () => {
      isActive = false;
    };
  }, [workoutIdParam, totalSets, setWorkoutData, workoutTitleParam, programIdParam]);


  const prevExerciseWeightsRef = useRef(exerciseWeights);
  useEffect(() => {
    if (prevExerciseWeightsRef.current === exerciseWeights) return;
    prevExerciseWeightsRef.current = exerciseWeights;
    if (workoutIdParam && workoutExercises.length > 0) {
      updateWeights(exerciseWeights);
    }
  }, [exerciseWeights, workoutIdParam, workoutExercises.length, updateWeights]);

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

  const getRightNavContent = () => {
    if (currentSet < activeTotalSets) {
      return <Entypo name="arrow-bold-right" size={42} color="white" />;
    }
    if (workoutExercises.length === 0) {
      return <Text style={styles.nextLiftText}>Next Lift</Text>;
    }
    if (currentExerciseIndex < workoutExercises.length - 1) {
      return <Text style={styles.nextLiftText}>Next Lift</Text>;
    }
    if (workoutSaved) {
      return <Text style={styles.nextLiftText}>Workout Done</Text>;
    }
    if (isSaving) {
      return <ActivityIndicator color="white" size="small" />;
    }
    return <Text style={styles.nextLiftText}>Finish</Text>;
  };

  const weightChangeTextHandler = (text: string) => {
    const numericValue = parseFloat(text);

    if (numericValue >= 1999) return;

    const newWeight = isNaN(numericValue) || numericValue < 0 ? 0 : numericValue;
    setTotalWeight(newWeight);
    if (currentExercise) {
      setExerciseWeights(prev => ({
        ...prev,
        [currentExercise.id]: { ...prev[currentExercise.id], [currentSet]: newWeight },
      }));
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
      if (currentExercise) {
        setExerciseWeights(prev => ({
          ...prev,
          [currentExercise.id]: { ...prev[currentExercise.id], [currentSet]: newWeight },
        }));
      }
    }
  };

  const closeStartModal = () => {
    setIsStartModalVisible(false);
    if (workouts.length > 0) {
      router.replace("/currentlift" as any);
    } else {
      router.replace("/");
    }
  };

  const selectWorkout = async (workout: WorkoutOption) => {
    setIsStartModalVisible(false);
    router.replace({
      pathname: "/currentlift" as any,
      params: {
        programId: String(selectedProgramId ?? ""),
        workoutId: String(workout.id),
        workoutTitle: workout.title,
        workoutSummary: workout.exercises?.length
          ? workout.exercises.join(" • ")
          : workout.title,
      },
    });
  };

  const calculateAndShowSummary = (weightsMap: Record<number, Record<number, number>>) => {
    const durationSeconds = Math.max(1, Math.round((Date.now() - workoutStartTimeRef.current) / 1000));
    let exercisesWithWeightCount = 0;
    let totalVolume = 0;
    let maxWeight = 0;
    let maxWeightExerciseName = "";

    const exerciseList = workoutExercises.length > 0 ? workoutExercises : (currentExercise ? [currentExercise] : []);

    exerciseList.forEach(ex => {
      const numSets = ex.sets ?? totalSets;
      const repsCount = ex.reps ?? reps;
      let hasWeightAboveZero = false;

      for (let s = 1; s <= numSets; s++) {
        const w = weightsMap[ex.id]?.[s] ?? 0;
        if (w > 0) {
          hasWeightAboveZero = true;
          totalVolume += w * repsCount;
          if (w > maxWeight) {
            maxWeight = w;
            maxWeightExerciseName = ex.name;
          }
        }
      }

      if (hasWeightAboveZero) {
        exercisesWithWeightCount++;
      }
    });

    const summary: WorkoutSummaryData = {
      durationSeconds,
      exercisesWithWeightCount,
      totalExercisesCount: exerciseList.length,
      totalVolume,
      maxWeight,
      maxWeightExerciseName,
    };

    setSummaryData(summary);
    setIsSummaryModalVisible(true);
  };

  const handleSaveWorkout = async () => {
    if (isSaving || workoutSaved) return;
    setIsSaving(true);
    try {
      const savePromises: Promise<unknown>[] = [];
      workoutExercises.forEach(ex => {
        const numSets = ex.sets ?? totalSets;
        for (let s = 1; s <= numSets; s++) {
          const weight = exerciseWeights[ex.id]?.[s];
          if (weight != null) savePromises.push(logWeight(ex.id, weight));
        }
      });
      await Promise.all(savePromises);
      setWorkoutSaved(true);
      markSaved();
      calculateAndShowSummary(exerciseWeights);
    } catch (error) {
      console.error("Error saving workout:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinishWorkoutEarly = async () => {
    if (isSaving || workoutSaved) return;
    setIsSaving(true);
    try {
      const updatedWeights: Record<number, Record<number, number>> = { ...exerciseWeights };
      const savePromises: Promise<unknown>[] = [];

      if (workoutExercises.length > 0) {
        workoutExercises.forEach((ex, exIndex) => {
          const numSets = ex.sets ?? totalSets;
          if (!updatedWeights[ex.id]) {
            updatedWeights[ex.id] = {};
          }
          for (let s = 1; s <= numSets; s++) {
            let weight = updatedWeights[ex.id]?.[s] ?? 0;
            if (exIndex > currentExerciseIndex || (exIndex === currentExerciseIndex && s > currentSet)) {
              weight = 0;
            }
            updatedWeights[ex.id][s] = weight;
            savePromises.push(logWeight(ex.id, weight));
          }
        });
      } else if (currentExercise) {
        const numSets = currentExercise.sets ?? totalSets;
        if (!updatedWeights[currentExercise.id]) {
          updatedWeights[currentExercise.id] = {};
        }
        for (let s = 1; s <= numSets; s++) {
          let weight = updatedWeights[currentExercise.id]?.[s] ?? 0;
          if (s > currentSet) {
            weight = 0;
          }
          updatedWeights[currentExercise.id][s] = weight;
          savePromises.push(logWeight(currentExercise.id, weight));
        }
      }

      setExerciseWeights(updatedWeights);
      await Promise.all(savePromises);
      setWorkoutSaved(true);
      markSaved();
      setIsMenuModalVisible(false);
      calculateAndShowSummary(updatedWeights);
    } catch (error) {
      console.error("Error finishing workout early:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReturnHome = () => {
    setIsSummaryModalVisible(false);
    clearWorkout();
    router.replace("/" as any);
  };

  const handleSelectDescription = () => {
    setIsMenuModalVisible(false);
    router.push({
      pathname: "/descriptionModal" as any,
      params: {
        title: activeLiftName,
        description: activeLiftDescription,
      },
    });
  };

  const modalBody = (
    <FlatList
      data={workouts}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Pressable
          style={modalStyles.itemButton}
          onPress={() => selectWorkout(item)}
        >
          <Text style={modalStyles.itemTitle}>{item.title}</Text>
        </Pressable>
      )}
      ListEmptyComponent={
        <Text style={modalStyles.emptyText}>
          No workouts found for this program.
        </Text>
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
            <Pressable
              style={modalStyles.backdropPressable}
              onPress={closeStartModal}
            />
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
        <WorkoutMenuModal
          visible={isMenuModalVisible}
          onClose={() => setIsMenuModalVisible(false)}
          onSelectDescription={handleSelectDescription}
          onFinishWorkoutEarly={handleFinishWorkoutEarly}
          isSaving={isSaving}
          workoutSaved={workoutSaved}
        />
        <WorkoutSummaryModal
          visible={isSummaryModalVisible}
          summaryData={summaryData}
          onReturnHome={handleReturnHome}
        />
        <View>
          <View>
            <View style={styles.header}>
              {/* <View style={styles.headerSpacer} /> */}
              <View style={styles.headerContent}>
                <Text
                  style={styles.exerciseName}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {activeLiftName}
                </Text>
              </View>
              <Pressable
                style={styles.menuButton}
                hitSlop={24}
                onPress={() => setIsMenuModalVisible(true)}
              >
                <Entypo name="dots-three-vertical" size={20} color="#929292" />
              </Pressable>
            </View>
            <View style={styles.weightSection}>
              <BarbellDisplay
                plates={plates}
                totalWeight={totalWeight}
                weightChangeHandler={weightChangeTextHandler}
              />
              <LastLiftContent
                lastWeight={currentExercise?.lastWeight}
              />
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
                  <Text style={styles.numberText}>{currentSet}</Text>
                </View>
                <Text style={styles.ofText}>of</Text>
                <View style={styles.numberBox}>
                  <Text style={styles.numberText}>{activeTotalSets}</Text>
                </View>
              </View>
            </View>
            <View style={styles.repsContainer}>
              <Text style={styles.sectionLabel}>Reps</Text>
              <View style={[styles.numberBox, styles.numberBoxCentered]}>
                <Text style={styles.numberText}>{activeReps}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.navContainer}>
          <Pressable
            hitSlop={24}
            style={styles.navButton}
            onPress={() => {
              if (currentSet > 1) {
                const prevSet = currentSet - 1;
                setCurrentSet(prevSet);
                setTotalWeight(exerciseWeights[currentExercise?.id ?? -1]?.[prevSet] ?? 0);
              } else if (currentExerciseIndex > 0) {
                const prevIndex = currentExerciseIndex - 1;
                const prevExercise = workoutExercises[prevIndex];
                const prevSets = prevExercise?.sets ?? totalSets;
                setCurrentExerciseIndex(prevIndex);
                setCurrentSet(prevSets);
                setTotalWeight(exerciseWeights[prevExercise?.id ?? -1]?.[prevSets] ?? 0);
              }
            }}
          >
            {currentSet === 1 && currentExerciseIndex === 0 ? (
              <Text style={styles.nextLiftText}>Prev Lift</Text>
            ) : (
              <Entypo name="arrow-bold-left" size={42} color="white" />
            )}
          </Pressable>
          <Pressable
            hitSlop={24}
            style={styles.navButton}
            onPress={() => {
              if (workoutSaved) return;
              if (currentSet < activeTotalSets) {
                const nextSet = currentSet + 1;
                setCurrentSet(nextSet);
                if (currentExercise) {
                  setExerciseWeights(prev => ({
                    ...prev,
                    [currentExercise.id]: { ...prev[currentExercise.id], [nextSet]: totalWeight },
                  }));
                }
              } else if (workoutExercises.length > 0 && currentExerciseIndex < workoutExercises.length - 1) {
                const nextIndex = currentExerciseIndex + 1;
                const nextExercise = workoutExercises[nextIndex];
                setCurrentExerciseIndex(nextIndex);
                setCurrentSet(1);
                setTotalWeight(exerciseWeights[nextExercise?.id ?? -1]?.[1] ?? 0);
              } else if (workoutExercises.length > 0) {
                handleSaveWorkout();
              }
            }}
          >
            {getRightNavContent()}
          </Pressable>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}


