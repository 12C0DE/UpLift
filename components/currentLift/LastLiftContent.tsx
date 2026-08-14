import { currentLiftStyles as styles } from "@/assets";
import { useMemo } from "react";
import { Text, View } from "react-native";


interface LastWeightProp {
    lastWeight?: number | null;
}

export const LastLiftContent = ({ lastWeight }: LastWeightProp) => {
    return useMemo(() => {
        const weight = lastWeight;
        if (weight != null && weight > 0) {
            return (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <Text style={styles.lastLift}>
                        Last lift:
                    </Text>
                    <Text style={[styles.lastLift, { fontWeight: 700 }]} >
                        {weight}
                    </Text>
                    <Text style={styles.lastLift}>lbs</Text>
                </View>
            );
        }
        return null;
    }, [lastWeight]);
};