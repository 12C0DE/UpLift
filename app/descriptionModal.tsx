import { descriptionModalStyles as styles } from "@/assets";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DescriptionModal() {
  const router = useRouter();
  const { title, description } = useLocalSearchParams<{
    title?: string;
    description?: string;
  }>();

  // const resolvedTitle = title?.trim() || "Details";
  const resolvedDescription = description?.trim() || "No description provided.";

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.description}>{resolvedDescription}</Text>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            eva nagas
          </Text>

        </View>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
