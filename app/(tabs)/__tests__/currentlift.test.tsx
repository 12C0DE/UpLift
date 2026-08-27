import { ActiveWorkoutProvider } from "@/context/ActiveWorkoutContext";
import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";
import CurrentLift from "../currentlift";

let mockSearchParams: Record<string, string> = {};

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockSearchParams,
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock("@/db/queries/exercises", () => ({
  getExercisesWithLastWeightByWorkout: jest.fn().mockImplementation(async (workoutId: number) => {
    if (workoutId === 1) {
      return [
        {
          id: 101,
          workoutId: 1,
          name: "Bench Press",
          sets: 2,
          reps: 5,
          description: "Chest compound press",
          lastWeight: 135,
        },
        {
          id: 102,
          workoutId: 1,
          name: "Incline Dumbbell Press",
          sets: 2,
          reps: 8,
          description: "Upper chest press",
          lastWeight: 50,
        },
      ];
    }
    return [];
  }),
}));

jest.mock("@/db/queries/workout", () => ({
  getWorkoutsByProgram: jest.fn().mockImplementation(async (programId: number) => [
    { id: 1, programId, title: "Chest Day", week: 1, exercises: ["Bench Press", "Incline DB"] },
  ]),
}));

jest.mock("@/db/queries/weights", () => ({
  logWeight: jest.fn().mockResolvedValue({ id: 1 }),
}));

describe("CurrentLift Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = {};
  });

  it("shows startup modal when start param is provided without workoutId", async () => {
    mockSearchParams = { start: "true", programId: "1" };

    let component: any;
    await act(async () => {
      component = renderer.create(
        <ActiveWorkoutProvider>
          <CurrentLift totalSets={3} liftName="Default" desc="" />
        </ActiveWorkoutProvider>
      );
    });

    const instance = component.root;
    const textElements = instance.findAllByType(Text);
    const textValues = textElements.map((t: any) =>
      Array.isArray(t.props.children)
        ? t.props.children.join("")
        : String(t.props.children ?? "")
    );

    expect(textValues).toContain("Choose Workout");
  });

  it("loads exercise data and displays active lift name when workoutId is provided", async () => {
    mockSearchParams = {
      programId: "1",
      workoutId: "1",
      workoutTitle: "Chest Day",
    };

    let component: any;
    await act(async () => {
      component = renderer.create(
        <ActiveWorkoutProvider>
          <CurrentLift totalSets={3} liftName="" desc="" />
        </ActiveWorkoutProvider>
      );
    });

    const instance = component.root;
    const textElements = instance.findAllByType(Text);
    const textValues = textElements.map((t: any) =>
      Array.isArray(t.props.children)
        ? t.props.children.join("")
        : String(t.props.children ?? "")
    );

    expect(textValues).toContain("Bench Press");
    expect(textValues).toContain("Last lift:");
    expect(textValues).toContain("135");
  });

  it("navigates through sets and saves workout showing total weight lifted in modal", async () => {
    mockSearchParams = {
      programId: "1",
      workoutId: "1",
      workoutTitle: "Chest Day",
    };

    let component: any;
    await act(async () => {
      component = renderer.create(
        <ActiveWorkoutProvider>
          <CurrentLift totalSets={3} liftName="" desc="" />
        </ActiveWorkoutProvider>
      );
    });

    const instance = component.root;

    // Press right navigation button repeatedly to advance through all sets and exercises
    // Bench Press (2 sets @ 135 lbs × 5 reps = 1350 lbs volume)
    // Incline DB Press (2 sets @ 50 lbs × 8 reps = 800 lbs volume)
    // Total Volume = 1350 + 800 = 2,150 lbs

    const getRightNavButton = () => {
      const navButtons = instance.findAll(
        (node: any) =>
          node.props && node.props.hitSlop === 24 && typeof node.props.onPress === "function"
      );
      return navButtons[navButtons.length - 1];
    };

    // Set 1 -> Set 2 (Bench Press)
    await act(async () => {
      getRightNavButton().props.onPress();
    });

    // Set 2 -> Ex 2 Set 1 (Incline DB Press)
    await act(async () => {
      getRightNavButton().props.onPress();
    });

    // Ex 2 Set 1 -> Ex 2 Set 2
    await act(async () => {
      getRightNavButton().props.onPress();
    });

    // Ex 2 Set 2 -> Finish & Save Workout
    await act(async () => {
      getRightNavButton().props.onPress();
    });

    // Check that logWeight was called for exercises
    const { logWeight } = require("@/db/queries/weights");
    expect(logWeight).toHaveBeenCalled();

    // Verify summary modal displays Total Volume of 2,150 lbs
    const textElements = instance.findAllByType(Text);
    const textValues = textElements.map((t: any) =>
      Array.isArray(t.props.children)
        ? t.props.children.join("")
        : String(t.props.children ?? "")
    );

    expect(textValues).toContain("Workout Complete!");
    expect(textValues.some((txt: string) => txt.includes("2,150 lbs"))).toBe(true);
  });
});
