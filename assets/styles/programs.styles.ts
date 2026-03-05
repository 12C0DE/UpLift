import { StyleSheet } from "react-native";

export const ProgramsStylesheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignSelf: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: "row",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    color: "#f5f5f5",
  },
  title: {
    fontFamily: "BebasNeue",
    fontSize: 40,
    textAlign: "center",
    color: "#f5f5f5",
    letterSpacing: 1.2,
    maxWidth: 350,
    marginHorizontal: 8,
    marginBottom: 24,
  },
  addButton: {
    width: "60%",
    paddingVertical: 16,
    backgroundColor: "#f6a800",
    color: "#0a0a0a",
    marginHorizontal: "auto",
    marginBottom: 32,
  },
  addLayout: {
    gap: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  progLayout: {
    gap: 2,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rowLayout: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  colLayout: {
    flex: 1,
    gap: 4,
  },
  addText: {
    fontFamily: "BebasNeue",
    fontSize: 24,
  },
  headerText: {
    fontFamily: "subHeaderText",
    fontSize: 24,
    color: "#929292",
    textAlign: "center",
    marginBottom: 24,
  },
  progText: {
    fontFamily: "BebasNeue",
    fontSize: 24,
    color: "#f5f5f5",
  },
  subText: {
    fontFamily: "italicFont",
    fontSize: 16,
    color: "#929292",
  },
  progButton: {
    width: "60%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#262626",
    color: "#0a0a0a",
    marginHorizontal: "auto",
    marginBottom: 32,
  },
});
