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
    kicker: {
        color: "#929292",
        fontFamily: "subHeaderText",
        fontSize: 13,
        letterSpacing: 0.6,
        textTransform: "uppercase",
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
        fontSize: 16,
        lineHeight: 24,
    },
    closeButton: {
        alignSelf: "center",
        width: "100%",
        maxWidth: 360,
        backgroundColor: "#262626",
        borderWidth: 1,
        borderColor: "#3b3b3b",
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#f5f5f5",
        fontFamily: "BebasNeue",
        fontSize: 24,
        letterSpacing: 0.8,
    },
});