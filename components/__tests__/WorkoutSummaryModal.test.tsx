import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";
import { WorkoutSummaryData, WorkoutSummaryModal } from "../WorkoutSummaryModal";

describe("WorkoutSummaryModal", () => {
  const mockSummaryData: WorkoutSummaryData = {
    durationSeconds: 145, // 2m 25s
    exercisesWithWeightCount: 2,
    totalExercisesCount: 3,
    totalVolume: 2025,
    maxWeight: 185,
    maxWeightExerciseName: "Bench Press",
  };

  it("renders null when summaryData is null", async () => {
    let tree: any;
    await act(async () => {
      tree = renderer
        .create(
          <WorkoutSummaryModal
            visible={true}
            onReturnHome={jest.fn()}
            summaryData={null}
          />
        )
        .toJSON();
    });
    expect(tree).toBeNull();
  });

  it("renders total volume (total weight lifted) correctly", async () => {
    let component: any;
    await act(async () => {
      component = renderer.create(
        <WorkoutSummaryModal
          visible={true}
          onReturnHome={jest.fn()}
          summaryData={mockSummaryData}
        />
      );
    });

    const instance = component.root;
    const textElements = instance.findAllByType(Text);
    const textValues = textElements.map((t: any) =>
      Array.isArray(t.props.children)
        ? t.props.children.join("")
        : String(t.props.children ?? "")
    );

    expect(textValues).toContain("Workout Complete!");
    expect(textValues).toContain("Total Volume");
    // Verify total weight amount lifted is formatted with comma and lbs
    expect(textValues.some((txt: string) => txt.includes("2,025 lbs"))).toBe(true);
    expect(textValues.some((txt: string) => txt.includes("185 lbs"))).toBe(true);
    expect(textValues.some((txt: string) => txt.includes("2m 25s"))).toBe(true);
  });

  it("triggers onReturnHome when home button is pressed", async () => {
    const onReturnHomeMock = jest.fn();
    let component: any;
    await act(async () => {
      component = renderer.create(
        <WorkoutSummaryModal
          visible={true}
          onReturnHome={onReturnHomeMock}
          summaryData={mockSummaryData}
        />
      );
    });

    const instance = component.root;
    const pressableNode = instance.find(
      (node: any) => typeof node.props?.onPress === "function"
    );
    await act(async () => {
      pressableNode.props.onPress();
    });

    expect(onReturnHomeMock).toHaveBeenCalledTimes(1);
  });
});
