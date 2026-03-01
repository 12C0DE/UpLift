import { StyleSheet } from "react-native";

export const LogsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  titleBar: {
    backgroundColor: "#f6a800",
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  titleText: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#0a0a0a",
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
  },
  headerRow: {
    backgroundColor: "#3a3a3a",
  },
  sectionRow: {
    backgroundColor: "#f6a800",
  },
  exerciseRow: {
    backgroundColor: "#2a2a2a",
  },
  headerText: {
    color: "#f6f6f6",
    fontWeight: "bold",
    fontSize: 12,
  },
  sectionText: {
    color: "#0a0a0a",
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "600",
  },
  smallText: {
    fontSize: 11,
    lineHeight: 16,
  },
  weightValueText: {
    fontFamily: "BebasNeue",
    fontSize: 24,
    color: "#f6f6f6",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#5a5353",
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
  },
  headerCell: {
    backgroundColor: "#3a3a3a",
  },
  sectionCell: {
    backgroundColor: "#f6a800",
  },
  cellText: {
    color: "#f6f6f6",
    fontSize: 13,
  },
});
