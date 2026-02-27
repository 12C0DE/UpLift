import { BarbellDisplay, WeightPlate } from "@/components";
import { useState } from "react";
import { Text, View } from "react-native";
import { styles as currentLiftStyles } from "../../assets/index";
import { BAR_WEIGHT, WEIGHT_LIST } from "../utils/constants";

interface CurrentLiftProps {
  liftName: string;
  lastWeight?: number;
  totalSets: number;
}

interface SetType {
  totalSets: number;
  currentSet: number;
}

export default function currentlift({
  liftName,
  lastWeight,
  totalSets,
}: CurrentLiftProps) {
  const [totalWeight, setTotalWeight] = useState(lastWeight || 285);
  const [reps, setReps] = useState(5);
  const [sets, setSets] = useState<SetType>({
    totalSets,
    currentSet: 1,
  });

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

  const weightChangeTextHandler = (text: string) => {
    const numericValue = parseInt(text);
    if (numericValue >= 0 && numericValue <= 1000) {
      setTotalWeight(numericValue);
    } else {
      setTotalWeight(0);
    }
  };

  const weightChangeHandler = (
    weightToAdd: number,
    direction: "up" | "down",
  ) => {
    const change = direction === "up" ? weightToAdd * 2 : -weightToAdd * 2;
    const newWeight = totalWeight + change;
    if (newWeight >= 0 && newWeight <= 1000) {
      setTotalWeight(newWeight);
    }
  };

  return (
    <View style={currentLiftStyles.container}>
      <View style={currentLiftStyles.header}>
        <Text style={currentLiftStyles.exerciseName}>
          {liftName || "Bench Press"}
        </Text>
      </View>
      <View style={currentLiftStyles.weightSection}>
        <BarbellDisplay
          plates={plates}
          totalWeight={totalWeight}
          weightChangeHandler={weightChangeTextHandler}
        />
      </View>
      <View style={currentLiftStyles.weightsRow}>
        {WEIGHT_LIST.toReversed().map((weight) => (
          <WeightPlate
            key={`w_${weight}`}
            weight={weight}
            onSwipeDown={() => weightChangeHandler(weight, "down")}
            onSwipeUp={() => weightChangeHandler(weight, "up")}
          />
        ))}
      </View>
    </View>
  );
}
