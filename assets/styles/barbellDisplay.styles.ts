import { StyleSheet } from 'react-native';

export const barbellDisplayStyles = StyleSheet.create({
    container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 67,
    gap: 4,
  },
  platesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  plate: {
    width: 22,
    backgroundColor: "#5c5c5c",
    borderWidth: 2,
    borderColor: "#797979",
    borderRadius: 2,
  },

  WeightInput: {
    borderWidth: 2,
    borderRadius: 5,
    width: "100%",
    maxWidth: 120,
    height: 70,
    fontSize: 50,
    textAlign: "center",
    color: "#eee",
    borderColor: "#262626"
  }
})