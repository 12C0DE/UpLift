import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function DescriptionModal() {
  const router = useRouter();
  const { title, description } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || "Details"}</Text>
      <Text style={styles.description}>{description || "No description provided."}</Text>
      {/* add any inputs or form controls here */}
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
