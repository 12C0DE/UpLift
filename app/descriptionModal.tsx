import { descriptionModalStyles as styles } from "@/assets";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const firstParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export default function DescriptionModal() {
  const router = useRouter();
  const { title, description } = useLocalSearchParams<{
    title?: string | string[];
    description?: string | string[];
  }>();

  const resolvedDescription = firstParam(description)?.trim();
  const hasDescription = Boolean(resolvedDescription);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.description}>
          {hasDescription ? resolvedDescription : "No description provided."}
        </Text>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
