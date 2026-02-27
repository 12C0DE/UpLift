import { barbellDisplayStyles as bbStyles } from "@/assets";
import { TextInput, View } from "react-native";

type BarbellDisplayProps = {
  plates: number[];
  totalWeight: number;
  weightChangeHandler: (text: string) => void;
};

const getPlateSize = (weight: number) => {
  const plateMap: Record<number, [number, number]> = {
    35: [60, 22],
    45: [67, 22],
    25: [54, 22],
    10: [48, 16],
    5: [42, 16],
    2.5: [36, 12],
  };

  return plateMap[weight] || 48;
};

export const BarbellDisplay = ({
  plates,
  totalWeight,
  weightChangeHandler,
}: BarbellDisplayProps) => {
  return (
    <View style={bbStyles.container}>
      <View style={bbStyles.platesRow}>
        {plates.toReversed().map((plate, index) => (
          <View
            key={`left_${index}`}
            style={[
              bbStyles.plate,
              { height: getPlateSize(plate)[0], width: getPlateSize(plate)[1] },
            ]}
          />
        ))}
      </View>
      <View>
        <TextInput
          keyboardType="number-pad"
          maxLength={3}
          value={totalWeight.toString()}
          style={bbStyles.weightInput}
          onChangeText={(text) => weightChangeHandler(text)}
        />
      </View>
      <View style={bbStyles.platesRow}>
        {plates.map((plate, index) => (
          <View
            key={`right_${index}`}
            style={[
              bbStyles.plate,
              { height: getPlateSize(plate)[0], width: getPlateSize(plate)[1] },
            ]}
          />
        ))}
      </View>
    </View>
  );
};
