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
    alignContent: 'center',
    justifyContent: "center",
    color: "#f5f5f5"
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
  progLayout: {
    // flex: 1,
    // flexDirection: "row",
    gap: 2,
    alignItems: "center",
    justifyContent: "center",
  },
   rowLayout: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  progText: {
    fontFamily: "BebasNeue",
    fontSize: 24,
  },
})