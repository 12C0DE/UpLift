import React from "react";
import { ScrollView } from "react-native";
import renderer, { act } from "react-test-renderer";
import Index from "../index";

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (callback: () => void) => callback(),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@/db/queries/programs", () => ({
  getRecentPrograms: jest.fn().mockResolvedValue([]),
}));

describe("Index screen", () => {
  it("places recent programs in a scroll view", async () => {
    let component: any;

    await act(async () => {
      component = renderer.create(<Index />);
    });

    expect(component.root.findAllByType(ScrollView)).toHaveLength(1);
  });
});
