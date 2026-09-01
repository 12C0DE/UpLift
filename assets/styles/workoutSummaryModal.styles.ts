import { StyleSheet } from "react-native";

export const workoutSummaryModalStyles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#2f2f2f",
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  trophyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(246, 168, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#f5f5f5",
    letterSpacing: 1,
  },
  statsGrid: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#1f1f1f",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  statTextGroup: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#9a9a9a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: "BebasNeue",
    fontSize: 22,
    color: "#ffffff",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statSubText: {
    fontSize: 11,
    color: "#777777",
    marginTop: 1,
  },
  homeBtn: {
    backgroundColor: "#f6a800",
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  homeBtnText: {
    fontFamily: "BebasNeue",
    fontSize: 22,
    color: "#0a0a0a",
    letterSpacing: 0.8,
  },
});