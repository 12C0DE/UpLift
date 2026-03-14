import { ProgramsStylesheet as styles } from "@/assets";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description: string;
}

interface WorkoutSection {
  title: string;
  week: string;
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
    existingProgram?.sections || [],
  );

  useEffect(() => {
    navigation.setOptions({
      title: id ? "Edit Program" : "Create Program",
    });
  }, [id]);

  //* SECTION Handlers

  const addSectionHandler = (newSection: WorkoutSection) => {
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const removeSectionHandler = (sectionToRemove: number) => {
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

  const handleSave = () => {};

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Edit Program</Text>
      </View> */}
    </View>
  );
};

export default EditProgram;

// import { useLocalSearchParams, useNavigation } from "expo-router";
// import { useEffect } from "react";

// const { id } = useLocalSearchParams();
// const navigation = useNavigation();

// useEffect(() => {
//   navigation.setOptions({
//     title: id ? "Edit Program" : "New Program",
//   });
// }, [id]);
