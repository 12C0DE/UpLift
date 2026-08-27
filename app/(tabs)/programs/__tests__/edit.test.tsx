import React from "react";
import { Alert, Text, TextInput } from "react-native";
import renderer, { act } from "react-test-renderer";
import EditProgramScreen from "../edit";

let mockSearchParams: Record<string, string> = {};
const mockSetOptions = jest.fn();

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockSearchParams,
  useNavigation: () => ({
    setOptions: mockSetOptions,
  }),
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock("@/db/queries/programs", () => ({
  createProgram: jest.fn().mockResolvedValue([{ id: 1 }]),
  getProgramById: jest.fn().mockImplementation(async (id: number) => {
    if (id === 1) {
      return { id: 1, name: "Hypertrophy 101" };
    }
    return null;
  }),
  updateProgram: jest.fn().mockResolvedValue({}),
}));

jest.mock("@/db/queries/workout", () => ({
  createWorkout: jest.fn().mockResolvedValue([{ id: 10 }]),
  getWorkoutsByProgram: jest.fn().mockImplementation(async (programId: number) => {
    if (programId === 1) {
      return [{ id: 10, title: "Leg Day", week: 1 }];
    }
    return [];
  }),
  updateWorkout: jest.fn().mockResolvedValue({}),
  deleteWorkout: jest.fn().mockResolvedValue({}),
}));

jest.mock("@/db/queries/exercises", () => ({
  createExercise: jest.fn().mockResolvedValue({}),
  getExercisesByWorkout: jest.fn().mockImplementation(async (workoutId: number) => {
    if (workoutId === 10) {
      return [
        { id: 100, workoutId: 10, name: "Squat", sets: 4, reps: 8, description: "Deep squat" },
      ];
    }
    return [];
  }),
  updateExercise: jest.fn().mockResolvedValue({}),
  deleteExercise: jest.fn().mockResolvedValue({}),
}));

const findPressableWithText = (instance: any, textSubstring: string) => {
  const textNodes = instance.findAllByType(Text);
  const targetText = textNodes.find((t: any) => {
    const content = Array.isArray(t.props.children)
      ? t.props.children.join("")
      : String(t.props.children ?? "");
    return content.includes(textSubstring);
  });
  if (!targetText) return undefined;

  let current = targetText;
  while (current) {
    if (current.props && typeof current.props.onPress === "function") {
      return current;
    }
    current = current.parent;
  }
  return undefined;
};

describe("EditProgram Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = {};
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  it("renders in Creation Mode when no id param is provided", async () => {
    let component: any;
    await act(async () => {
      component = renderer.create(<EditProgramScreen />);
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(mockSetOptions).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Create Program" })
    );

    const instance = component.root;
    const inputs = instance.findAllByType(TextInput);
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("loads program and exercises in Edit Mode when id param is provided", async () => {
    mockSearchParams = { id: "1" };

    let component: any;
    await act(async () => {
      component = renderer.create(<EditProgramScreen />);
      await new Promise((r) => setTimeout(r, 50));
    });

    const instance = component.root;
    const inputs = instance.findAllByType(TextInput);
    const inputValues = inputs.map((i: any) => i.props.value);

    expect(mockSetOptions).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Edit Program" })
    );
    expect(inputValues).toContain("Hypertrophy 101");
    expect(inputValues).toContain("Leg Day");
    expect(inputValues).toContain("Squat");
  });

  it("alerts validation error if program name is empty on save", async () => {
    mockSearchParams = {};

    let component: any;
    await act(async () => {
      component = renderer.create(<EditProgramScreen />);
      await new Promise((r) => setTimeout(r, 50));
    });

    const instance = component.root;
    const saveButton = findPressableWithText(instance, "Save Program");

    expect(saveButton).toBeDefined();

    if (saveButton) {
      await act(async () => {
        saveButton.props.onPress();
        await new Promise((r) => setTimeout(r, 50));
      });
    }

    expect(Alert.alert).toHaveBeenCalledWith(
      "Program name required",
      "Please enter a program name."
    );
  });

  it("creates a new program when program name is filled in Creation Mode", async () => {
    mockSearchParams = {};

    let component: any;
    await act(async () => {
      component = renderer.create(<EditProgramScreen />);
      await new Promise((r) => setTimeout(r, 50));
    });

    const instance = component.root;
    const inputs = instance.findAllByType(TextInput);
    const programNameInput = inputs[0];

    await act(async () => {
      programNameInput.props.onChangeText("New Powerlifting Program");
    });

    const saveButton = findPressableWithText(instance, "Save Program");

    expect(saveButton).toBeDefined();

    if (saveButton) {
      await act(async () => {
        saveButton.props.onPress();
        await new Promise((r) => setTimeout(r, 50));
      });
    }

    const { createProgram } = require("@/db/queries/programs");
    const { router } = require("expo-router");
    expect(createProgram).toHaveBeenCalledWith("New Powerlifting Program");
    expect(router.back).toHaveBeenCalled();
  });

  it("updates existing program in Edit Mode", async () => {
    mockSearchParams = { id: "1" };

    let component: any;
    await act(async () => {
      component = renderer.create(<EditProgramScreen />);
      await new Promise((r) => setTimeout(r, 50));
    });

    const instance = component.root;
    const inputs = instance.findAllByType(TextInput);
    const programNameInput = inputs[0];

    await act(async () => {
      programNameInput.props.onChangeText("Updated Hypertrophy 101");
    });

    const saveButton = findPressableWithText(instance, "Save Program");

    expect(saveButton).toBeDefined();

    if (saveButton) {
      await act(async () => {
        saveButton.props.onPress();
        await new Promise((r) => setTimeout(r, 50));
      });
    }

    const { updateProgram } = require("@/db/queries/programs");
    const { router } = require("expo-router");
    expect(updateProgram).toHaveBeenCalledWith(1, "Updated Hypertrophy 101");
    expect(router.back).toHaveBeenCalled();
  });

  it("navigates to /currentlift when Start Workout button is pressed in Edit Mode", async () => {
    mockSearchParams = { id: "1" };

    let component: any;
    await act(async () => {
      component = renderer.create(<EditProgramScreen />);
      await new Promise((r) => setTimeout(r, 50));
    });

    const instance = component.root;
    const startWorkoutBtn = findPressableWithText(instance, "Start Workout");

    expect(startWorkoutBtn).toBeDefined();

    if (startWorkoutBtn) {
      await act(async () => {
        startWorkoutBtn.props.onPress();
        await new Promise((r) => setTimeout(r, 50));
      });
    }

    const { router } = require("expo-router");
    expect(router.push).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/currentlift",
        params: expect.objectContaining({
          programId: "1",
          workoutId: "10",
          workoutTitle: "Leg Day",
        }),
      })
    );
  });
});
