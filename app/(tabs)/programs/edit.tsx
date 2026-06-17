import { EditProgramStyles as styles } from "@/assets";
import {
  createProgram,
  getProgramById,
  updateProgram,
} from "@/db/queries/programs";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
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

const EditProgram = () => {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const programId = Array.isArray(id) ? id[0] : id;
  const navigation = useNavigation();
  const [programName, setProgramName] = useState("");
  const [sections, setSections] = useState<WorkoutSection[]>([defaultWoSection]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Back",
    });
  }, [navigation, programId]);

  useEffect(() => {
    const loadProgram = async () => {
      if (!programId) return;

      try {
        const program = await getProgramById(programId);
        if (!program) return;
        setProgramName(program.name);
      } catch (error) {
        console.error("Error loading program:", error);
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

  const onSave = async (program: ProgramData) => {
    setIsSaving(true);

    try {
      if (programId) {
        await updateProgram(programId, program.programName);
      } else {
        await createProgram(program.programName);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {programId ? "Edit Program" : "Create Program"}
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
                      <View>
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
                      <View>
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
                      style={styles.exerciseInput}
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
export default EditProgram;
