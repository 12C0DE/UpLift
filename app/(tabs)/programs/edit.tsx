import { EditProgramStyles as styles } from "@/assets";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface Exercise {
  name: string;
  sets: number;
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

interface CreateEditProgramProps {
  existingProgram?: ProgramData;
  onSave: (program: ProgramData) => void;
  onCancel: () => void;
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

const EditProgram = ({
  existingProgram,
  onSave,
  onCancel,
}: CreateEditProgramProps) => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [programName, setProgramName] = useState(
    existingProgram?.programName || "",
  );
  const [sections, setSections] = useState<WorkoutSection[]>(
    existingProgram?.sections || [defaultWoSection],
  );

  useEffect(() => {
    navigation.setOptions({
      title: "Back",
    });
  }, [id]);

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

  const handleSave = () => {
    if (!programName.trim()) {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {existingProgram ? "Edit Program" : "Create Program"}
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
                    placeholder="Workout Title"
                    placeholderTextColor={"#7a7a7a"}
                  />
                  <TextInput
                    style={styles.sectionInput}
                    value={section.week}
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
                          value={exercise.sets.toString()}
                          placeholder="Sets"
                          placeholderTextColor={"#7a7a7a"}
                        />
                      </View>
                      <View>
                        <Text style={styles.exerciseLabel}>Reps</Text>
                        <TextInput
                          style={styles.exerciseInput}
                          keyboardType="number-pad"
                          value={exercise.reps}
                          placeholder="8-10"
                          placeholderTextColor={"#7a7a7a"}
                        />
                      </View>
                    </View>
                    <TextInput
                      style={styles.exerciseInput}
                      numberOfLines={2}
                      value={exercise.description}
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
    </View>
  );
};
export default EditProgram;
