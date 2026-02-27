import { StyleSheet } from "react-native";

export const currentLiftStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: "row",
    flex: 1,
    alignContent: 'center',
    justifyContent: "center",
  },
  descButton: {
    color: "#f5f5f5",
    marginRight: 4
  },  
  exerciseName: {
    fontFamily: "BebasNeue",
    fontSize: 40,
    textAlign: "center",
    color: "#f5f5f5",
    letterSpacing: 1.2,
    maxWidth: 350,
    marginHorizontal: 8
  },
  weightSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  barbellContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  weightOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  weightText: {
    fontFamily: "BebasNeue",
    fontSize: 64,
    color: "#f9f9f9",
  },
  lastLift: {
    // fontFamily: "BarlowSemiCondensed_Italic",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    color: "#929292",
    marginTop: 8,
  },
  platesSection: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
  },
  platesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 24,
    maxWidth: 300,
  },
  swipeHint: {
    textAlign: "center",
    color: "#929292",
    fontSize: 10,
    marginTop: 16,
    fontStyle: "italic",
  },
  nextLiftText: {
    fontFamily: "BebasNeue",
    fontSize: 18,
    color: "#f5f5f5",
    letterSpacing: 0.72,
  },
  setsRepsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  setsContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#f5f5f5",
    letterSpacing: 0.96,
  },
  setsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  numberBox: {
    backgroundColor: "#262626",
    width: 44,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  numberBoxCentered: {
    width: 48,
    height: 48,
    alignSelf: "center",
    marginTop: 8,
  },
  numberText: {
    fontFamily: "BebasNeue",
    fontSize: 36,
    color: "#f9f9f9",
  },
  ofText: {
    fontFamily: "BebasNeue",
    fontSize: 24,
    color: "#f5f5f5",
    letterSpacing: 0.72,
  },
  repsContainer: {
    alignItems: "center",
  },
  navContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 77,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: "#404040",
  },
  navButton: {
    padding: 16,
  },
  weightsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 4,
    paddingHorizontal: 40,
  },
});
