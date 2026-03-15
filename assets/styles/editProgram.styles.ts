import { StyleSheet } from "react-native";

export const EditProgramStyles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#0a0a0a",
    color: "#f6f6f6",
    paddingBottom: 24,
  },
  header: {
    backgroundColor: "#3a3a3a",
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "BebasNeue",
    fontSize: 36,
    color: "#f6f6f6",
    letterSpacing: 1.2,
  },
  programName: {
    width: "100%",
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    padding: 16,
    backgroundColor: "#2a2a2a",
    // border: "2px solid #5a5353",
    color: "#f6f6f6",
    borderRadius: 8,
    borderColor: "#5a5353",
    borderWidth: 2,
  },
  sectionsContainer: {
    // backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 24,
    flex: 1,
    gap: 16,
  },
  section: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: "#5a5353",
  },
  rowLayout: {
    flexDirection: "row",
  },
});
