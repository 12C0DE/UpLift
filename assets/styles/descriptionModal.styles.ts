import { StyleSheet } from "react-native";

export const descriptionModalStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#0a0a0a",
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 28,
        justifyContent: "space-between",
    },
    headerRow: {
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#141414",
        borderColor: "#2f2f2f",
        borderWidth: 1,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 20,
        gap: 14,
        marginBottom: 20,
    },
    title: {
        color: "#f5f5f5",
        fontFamily: "BebasNeue",
        fontSize: 42,
        letterSpacing: 1,
        lineHeight: 44,
    },
    description: {
        color: "#d5d5d5",
        fontFamily: "bodyText",
        fontSize: 24,
        lineHeight: 28,
    },
    closeButton: {
        alignSelf: "center",
        width: "100%",
        alignItems: "center",
        fontSize: 24,
    },
    closeButtonText: {
        color: "#f5f5f5",
        fontFamily: "BebasNeue",
        fontSize: 32,
        letterSpacing: 0.8,
    },
});