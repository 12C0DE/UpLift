import { StyleSheet } from "react-native";

export const currentLiftStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignSelf: "center",
    width: "100%",
    justifyContent: "space-evenly",
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "99%",
  },
  descButton: {
    color: "#f5f5f5",
    marginLeft: 6,
    marginRight: 0,
  },  
  exerciseName: {
    fontFamily: "BebasNeue",
    fontSize: 40,
    textAlign: "center",
    color: "#f5f5f5",
    letterSpacing: 1.2,
    marginHorizontal: 1,
    flexShrink: 1,
    marginLeft: 24,

    // paddingHorizontal: 2,
  },
  weightSection: {
    padding: 16,
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
    fontSize: 22,
    color: "#f5f5f5",
    letterSpacing: 0.72,
  },
  setsRepsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    padding: 16,
  },
  weightsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  weightsStack: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
});

export const currentLiftModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "flex-start",
    paddingVertical: 100,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: "#121212",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2f2f2f",
    padding: 20,
    maxHeight: "60%",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sheetTitle: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#f5f5f5",
    letterSpacing: 0.8,
    textDecorationLine: "underline",
    textDecorationColor: "#f6a800",
  },
  closeText: {
    color: "#9a9a9a",
    fontSize: 14,
  },
  sectionLabel: {
    color: "#d6d6d6",
    fontSize: 14,
    marginBottom: 12,
  },
  itemButton: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  itemTitle: {
    color: "#f5f5f5",
    fontFamily: "BebasNeue",
    fontSize: 20,
    letterSpacing: 0.6,
  },
  itemSubtitle: {
    color: "#9a9a9a",
    fontSize: 13,
    marginTop: 4,
  },
  emptyText: {
    color: "#9a9a9a",
    textAlign: "center",
    marginTop: 16,
  },
  errorText: {
    color: "#ff8a8a",
    marginBottom: 12,
  },
});
