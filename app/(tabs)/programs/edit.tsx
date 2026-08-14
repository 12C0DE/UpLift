import { EditProgramStyles as styles } from "@/assets";
import { createExercise } from "@/db/queries/exercises";
import {
  createProgram,
  getProgramById,
  updateProgram,
} from "@/db/queries/programs";
import { createWorkout } from "@/db/queries/workout";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface Exercise {
  name: string;
  sets: number | null;
  reps: string;
  description: string;
}

interface WorkoutSection {
  title: string;
  week?: string;
  exercises: Exercise[];
}

interface ProgramData {
  programName: string;
  sections: WorkoutSection[];
}

const defaultExercise: Exercise = {
  name: "",
  sets: 1,
  reps: "",
  description: "",
};

const defaultWoSection: WorkoutSection = {
  title: "",
  week: "",
  exercises: [defaultExercise],
};

type DbExercise = Awaited<ReturnType<typeof import('@/db/queries/exercises').getExercisesByWorkout>>[number];

const formatExercise = (ex: DbExercise): Exercise => ({
  name: ex.name,
  sets: ex.sets ?? null,
  reps: ex.reps?.toString() ?? "",
  description: ex.description ?? "",
});

const loadSections = async (programId: number): Promise<WorkoutSection[]> => {
  const { getWorkoutsByProgram } = await import('@/db/queries/workout');
  const { getExercisesByWorkout } = await import('@/db/queries/exercises');
  const sectionsData = await getWorkoutsByProgram(programId);
  return Promise.all(
    sectionsData.map(async (section) => {
      const dbExercises = await getExercisesByWorkout(section.id);
      return {
        title: section.title,
        week: section.week?.toString() ?? "",
        exercises: dbExercises.map(formatExercise),
      };
    }),
  );
};

const EditProgram = () => {
  const { id } = useLocalSearchParams();
  const programIdValue = Array.isArray(id) ? id[0] : id;
  const programId = typeof programIdValue === "string" ? Number(programIdValue) : undefined;
  const navigation = useNavigation();
  const [programName, setProgramName] = useState("");
  const [sections, setSections] = useState<WorkoutSection[]>([defaultWoSection]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!programId);

  useEffect(() => {
    navigation.setOptions({
      title: programId ? "Edit" : "Create",
      backButtonTitle: "Back",
    });
  }, [navigation, programId]);

  useEffect(() => {
    const loadProgram = async () => {
      if (!programId) {
        setProgramName("");
        setSections([defaultWoSection]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const program = await getProgramById(programId);
        if (!program) return;
        setProgramName(program.name);

        const formattedSections = await loadSections(programId);
        setSections(formattedSections.length > 0 ? formattedSections : [defaultWoSection]);
      } catch (error) {
        console.error("Error loading program:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProgram();
  }, [programId]);

  //* SECTION Handlers

  const addSectionHandler = () => {
    const newSection: WorkoutSection = {
      title: "",
      week: "",
      exercises: [defaultExercise],
    };
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const removeSectionHandler = (sectionToRemove: number) => {
    if (sections.length === 1) {
      setSections([defaultWoSection]);
      return;
    }

    setSections((prevSections) =>
      prevSections.filter((_, index) => index !== sectionToRemove),
    );
  };

  const updateSectionHandler = (
    sectionToUpdate: number,
    updatedSection: WorkoutSection,
  ) => {
    const newSections = [...sections];
    newSections[sectionToUpdate] = updatedSection;
    setSections(newSections);
  };

  //* Exercise Handlers

  const addExerciseHandler = (sectionIndex: number, newExercise: Exercise) => {
    const newSections = [...sections];

    newSections[sectionIndex].exercises.push(newExercise);
    setSections(newSections);
  };

  const removeExerciseHandler = (
    sectionIndex: number,
    exerciseToRemove: number,
  ) => {
    const newSections = [...sections];
    if (sections.length === 1) {
      newSections[0].exercises = [defaultExercise];
      setSections(newSections);
      return;
    }

    newSections[sectionIndex].exercises = newSections[
      sectionIndex
    ].exercises.filter((_, index) => index !== exerciseToRemove);
    setSections(newSections);
  };

  const updateExerciseHandler = (
    sectionIndex: number,
    exerciseToUpdate: number,
    updatedExercise: Exercise,
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].exercises[exerciseToUpdate] = updatedExercise;
    setSections(newSections);
  };

  const saveExercises = async (workoutId: number, exercises: Exercise[]) => {
    for (let eIdx = 0; eIdx < exercises.length; eIdx++) {
      const exercise = exercises[eIdx];
      const repsNum = exercise.reps ? Number.parseInt(exercise.reps, 10) : undefined;
      await createExercise(
        workoutId,
        exercise.name,
        exercise.sets ?? undefined,
        repsNum !== undefined && !Number.isNaN(repsNum) ? repsNum : undefined,
        exercise.description,
        eIdx,
      );
    }
  };

  const saveSections = async (newProgramId: number, sections: WorkoutSection[]) => {
    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const section = sections[sIdx];
      const weekNum = section.week ? Number.parseInt(section.week, 10) : undefined;
      const workoutResult = await createWorkout(
        newProgramId,
        section.title,
        weekNum !== undefined && !Number.isNaN(weekNum) ? weekNum : undefined,
        undefined,
        sIdx,
      );
      await saveExercises(workoutResult[0].id, section.exercises);
    }
  };

  const updateSections = async (existingProgramId: number, sections: WorkoutSection[]) => {
    const { getWorkoutsByProgram, updateWorkout } = await import('@/db/queries/workout');
    const { getExercisesByWorkout, updateExercise } = await import('@/db/queries/exercises');

    const existingSections = await getWorkoutsByProgram(existingProgramId);

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const section = sections[sIdx];
      const weekNum = section.week ? Number.parseInt(section.week, 10) : undefined;

      if (sIdx < existingSections.length) {
        // Update existing workout
        const existingWorkout = existingSections[sIdx];
        await updateWorkout(existingWorkout.id, section.title, weekNum !== undefined && !Number.isNaN(weekNum) ? weekNum : undefined, +sIdx);

        // Update exercises
        const existingExercises = await getExercisesByWorkout(existingWorkout.id);
        for (let eIdx = 0; eIdx < section.exercises.length; eIdx++) {
          const exercise = section.exercises[eIdx];
          const repsNum = exercise.reps ? Number.parseInt(exercise.reps, 10) : undefined;

          if (eIdx < existingExercises.length) {
            // Update existing exercise
            const existingExercise = existingExercises[eIdx];
            await updateExercise(
              existingExercise.id,
              exercise.name,
              exercise.sets ?? undefined,
              repsNum !== undefined && !Number.isNaN(repsNum) ? repsNum : undefined,
              exercise.description,
              eIdx,
            );
          } else {
            // Create new exercise
            await createExercise(
              existingWorkout.id,
              exercise.name,
              exercise.sets ?? undefined,
              repsNum !== undefined && !Number.isNaN(repsNum) ? repsNum : undefined,
              exercise.description,
              eIdx,
            );
          }
        }

        // Delete any extra exercises
        for (let eIdx = section.exercises.length; eIdx < existingExercises.length; eIdx++) {
          const existingExercise = existingExercises[eIdx];
          await import('@/db/queries/exercises').then(({ deleteExercise }) => deleteExercise(existingExercise.id));
        }
      } else {
        // Create new workout and its exercises
        const workoutResult = await createWorkout(
          existingProgramId,
          section.title,
          weekNum !== undefined && !Number.isNaN(weekNum) ? weekNum : undefined,
          undefined,
          sIdx,
        );
        await saveExercises(workoutResult[0].id, section.exercises);
      }
    }

    // Delete any extra workouts
    for (let sIdx = sections.length; sIdx < existingSections.length; sIdx++) {
      const existingWorkout = existingSections[sIdx];
      await import('@/db/queries/workout').then(({ deleteWorkout }) => deleteWorkout(existingWorkout.id));
    }
  };

  const onSave = async (program: ProgramData) => {
    setIsSaving(true);

    try {
      if (programId) {
        await updateProgram(programId, program.programName);
        await updateSections(programId, program.sections);
      } else {
        const result = await createProgram(program.programName);
        await saveSections(result[0].id, program.sections);
      }

      router.back();
    } catch (error) {
      console.error("Error saving program:", error);
      Alert.alert("Save failed", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!programName.trim()) {
      return;
    }

    const programData: ProgramData = {
      programName: programName.trim(),
      sections,
    };
    await onSave(programData);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {"Program"}
        </Text>
        <TextInput
          style={styles.programName}
          value={programName}
          onChangeText={setProgramName}
          placeholder="Program Name"
          placeholderTextColor="#888"
        />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled" // important — lets you tap inputs without dismissing keyboard first
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionsContainer}>
          {sections.map((section, sectionIdx) => (
            <View key={`sec-${sectionIdx}`} style={styles.section}>
              {!!programId &&
                <Pressable
                  style={styles.workoutBtn}
                  onPress={() => router.push(`/currentlift?programId=${programId}&start=1`)}
                >
                  <Text>Start Workout</Text>
                </Pressable>
              }
              <View style={styles.sectionHeader}>
                <View style={styles.sectionInputContainer}>
                  <TextInput
                    style={styles.sectionInput}
                    value={section.title}
                    onChangeText={(text) => {
                      const updatedSection = { ...section, title: text };
                      updateSectionHandler(sectionIdx, updatedSection);
                    }}
                    placeholder="Workout Title"
                    placeholderTextColor={"#7a7a7a"}
                  />
                  <TextInput
                    style={styles.sectionInput}
                    value={section.week}
                    onChangeText={(text) => {
                      const updatedSection = { ...section, week: text };
                      updateSectionHandler(sectionIdx, updatedSection);
                    }}
                    placeholder="Week (optional)"
                    placeholderTextColor={"#7a7a7a"}
                  />
                </View>
                <Pressable
                  style={styles.trashBtn}
                  hitSlop={24}
                  onPress={() => removeSectionHandler(sectionIdx)}
                >
                  <Feather name="trash" size={24} color="#929292" />
                </Pressable>
              </View>
              <View style={styles.exerciseContainer}>
                {section.exercises.map((exercise, exerciseIdx) => (
                  <View key={`ex-${sectionIdx}-${exerciseIdx}`}>
                    <View style={styles.exerciseHeader}>
                      <TextInput
                        style={styles.exerciseInput}
                        value={exercise.name}
                        onChangeText={(text) => {
                          const updatedExercise = { ...exercise, name: text };
                          updateExerciseHandler(
                            sectionIdx,
                            exerciseIdx,
                            updatedExercise,
                          );
                        }}
                        placeholder="Exercise Name"
                        placeholderTextColor={"rgb(122, 122, 122)"}
                      />
                      <Pressable
                        style={[styles.trashBtn, { marginTop: 8 }]}
                        hitSlop={20}
                        onPress={() =>
                          removeExerciseHandler(sectionIdx, exerciseIdx)
                        }
                      >
                        <Feather name="trash" size={16} color="#929292" />
                      </Pressable>
                    </View>
                    <View style={styles.exerciseRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exerciseLabel}>Sets</Text>
                        <TextInput
                          keyboardType="number-pad"
                          style={styles.exerciseInput}
                          value={exercise.sets?.toString() ?? ""}
                          onChangeText={(text) => {
                            const sets = Number.parseInt(text) || null;
                            const updatedExercise = { ...exercise, sets };
                            updateExerciseHandler(
                              sectionIdx,
                              exerciseIdx,
                              updatedExercise,
                            );
                          }}
                          placeholder="Sets"
                          placeholderTextColor={"#7a7a7a"}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exerciseLabel}>Reps</Text>
                        <TextInput
                          style={styles.exerciseInput}
                          keyboardType="number-pad"
                          value={exercise.reps?.toString() ?? ""}
                          onChangeText={(text) => {
                            const updatedExercise = { ...exercise, reps: text };
                            updateExerciseHandler(
                              sectionIdx,
                              exerciseIdx,
                              updatedExercise,
                            );
                          }}
                          placeholder="8-10"
                          placeholderTextColor={"#7a7a7a"}
                        />
                      </View>
                    </View>
                    <TextInput
                      multiline
                      style={[styles.exerciseInput, { height: 60, textAlignVertical: "top" }]}
                      numberOfLines={2}
                      value={exercise.description}
                      onChangeText={(text) => {
                        const updatedExercise = { ...exercise, description: text };
                        updateExerciseHandler(
                          sectionIdx,
                          exerciseIdx,
                          updatedExercise,
                        );
                      }}
                      placeholder="Description"
                      placeholderTextColor={"#7a7a7a"}
                    />
                    <View style={styles.divider} />
                  </View>
                ))}
                <Text style={styles.exerciseFooter}>
                  Exercise count: {section.exercises.length}
                </Text>
              </View>
              <Pressable
                style={styles.addBtn}
                onPress={() => addExerciseHandler(sectionIdx, defaultExercise)}
              >
                <Entypo name="plus" size={24} color="#f6f6f6" />
                <Text style={styles.addBtnText}>Exercise</Text>
              </Pressable>
            </View>
          ))}
          <Pressable
            style={[styles.addBtn, { marginTop: 12 }]}
            onPress={() => addSectionHandler()}
          >
            <Entypo name="plus" size={24} color="#f6f6f6" />
            <Text style={styles.addBtnText}>New Workout</Text>
          </Pressable>
          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={[styles.footerBtn, styles.footerCancelBtn]}
          onPress={() => router.back()}
        >
          <Text style={[styles.footerBtnText, { color: "#f6f6f6" }]}>
            Cancel
          </Text>
        </Pressable>
        <Pressable
          style={[styles.footerBtn, styles.footerSaveBtn]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={[styles.footerBtnText, { color: "#0a0a0a" }]}>
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const EditProgramScreen = () => (
  <Suspense fallback={<ActivityIndicator size="large" style={{ flex: 1 }} />}>
    <EditProgram />
  </Suspense>
);

export default EditProgramScreen;
