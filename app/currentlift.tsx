import { currentLiftStyles as styles } from "@/assets";
import { BarbellDisplay, WeightPlate } from "@/components";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BAR_WEIGHT, WEIGHT_LIST } from "@/utils";

interface CurrentLiftProps {
  liftName: string;
  desc: string;
  lastWeight?: number;
  totalSets: number;
  reps?: number;
}

interface SetType {
  totalSets: number;
  currentSet: number;
}

export default function CurrentLift({
  liftName = "Bench",
  desc = "Lay on a flat bench and press barbell to your chest and back up.",
  lastWeight = 255,
  totalSets = 4,
  reps = 5,
}: CurrentLiftProps) {
  const [totalWeight, setTotalWeight] = useState(lastWeight || 285);
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
    const numericValue = parseFloat(text);

    if (numericValue >= 1000) return;

    if (isNaN(numericValue) || numericValue < 0) {
      setTotalWeight(0);
      return;
    } else {
      setTotalWeight(numericValue);
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
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <View style={{ width: 16 }}></View>
          <Text style={styles.exerciseName}>{liftName}</Text>
          <View>
            <Pressable
              style={styles.descButton}
              hitSlop={24}
              onPress={() =>
                router.push({
                  pathname: "/descriptionModal" as any,
                  params: {
                    title: liftName,
                    description: desc,
                  },
                })
              }
            >
              <Entypo name="info-with-circle" size={18} color="#929292" />
            </Pressable>
          </View>
        </View>
        <View style={styles.weightSection}>
          <BarbellDisplay
            plates={plates}
            totalWeight={totalWeight}
            weightChangeHandler={weightChangeTextHandler}
          />
          <Text style={styles.lastLift}>
            {lastWeight && `Last: ${lastWeight} lbs`}
          </Text>
        </View>
      </View>
      <View>
        <View style={styles.weightsRow}>
          {WEIGHT_LIST.toReversed().map((weight) => (
            <WeightPlate
              key={`w_${weight}`}
              weight={weight}
              onSwipeDown={() => weightChangeHandler(weight, "down")}
              onSwipeUp={() => weightChangeHandler(weight, "up")}
            />
          ))}
        </View>
        <Text style={styles.swipeHint}>Swipe up or down to change weight</Text>
      </View>
      <View style={styles.setsRepsSection}>
        <View style={styles.setsContainer}>
          <Text style={styles.sectionLabel}>Sets</Text>
          <View style={styles.setsRow}>
            <View style={styles.numberBox}>
              <Text style={styles.numberText}>{sets.currentSet}</Text>
            </View>
            <Text style={styles.ofText}>of</Text>
            <View style={styles.numberBox}>
              <Text style={styles.numberText}>{totalSets}</Text>
            </View>
          </View>
        </View>
        <View style={styles.repsContainer}>
          <Text style={styles.sectionLabel}>Reps</Text>
          <View style={[styles.numberBox, styles.numberBoxCentered]}>
            <Text style={styles.numberText}>{reps}</Text>
          </View>
        </View>
      </View>
      <View style={styles.navContainer}>
        <Pressable
          style={styles.navButton}
          onPress={() => {
            if (sets.currentSet > 1) {
              setSets({ ...sets, currentSet: sets.currentSet - 1 });
            } else {
              console.log("Previous exercise");
            }
          }}
        >
          {sets.currentSet === 1 ? (
            <Text style={styles.nextLiftText}>Prev Lift</Text>
          ) : (
            <Entypo name="arrow-bold-left" size={36} color="white" />
          )}
        </Pressable>
        <Pressable
          style={styles.navButton}
          onPress={() => {
            if (sets.currentSet < totalSets) {
              setSets({ ...sets, currentSet: sets.currentSet + 1 });
            } else {
              console.log("Next exercise");
            }
          }}
        >
          {sets.currentSet < totalSets ? (
            <Entypo name="arrow-bold-right" size={36} color="white" />
          ) : (
            <Text style={styles.nextLiftText}>Next Lift</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
