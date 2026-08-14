import { currentLiftModalStyles as modalStyles } from "@/assets";
import Entypo from "@expo/vector-icons/Entypo";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface WorkoutMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDescription: () => void;
  onFinishWorkoutEarly: () => void;
  isSaving: boolean;
  workoutSaved: boolean;
}

type ModalViewMode = "menu" | "timer" | "confirmFinish";

const PRESET_TIMES = [
  { label: "30s", seconds: 30 },
  { label: "60s", seconds: 60 },
  { label: "90s", seconds: 90 },
  { label: "2m", seconds: 120 },
  { label: "3m", seconds: 180 },
  { label: "5m", seconds: 300 },
];

export const WorkoutMenuModal: React.FC<WorkoutMenuModalProps> = ({
  visible,
  onClose,
  onSelectDescription,
  onFinishWorkoutEarly,
  isSaving,
  workoutSaved,
}) => {
  const [viewMode, setViewMode] = useState<ModalViewMode>("menu");

  // Timer state
  const [selectedPreset, setSelectedPreset] = useState<number>(60);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const targetEndTimeRef = useRef<number | null>(null);
  const notificationIdRef = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
      } catch (err) {
        console.log("Error requesting notification permissions:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!visible) {
      setViewMode("menu");
    }
  }, [visible]);

  const cancelScheduledNotification = async () => {
    if (notificationIdRef.current) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
      } catch (err) {
        console.log("Error canceling notification:", err);
      }
      notificationIdRef.current = null;
    }
  };

  const scheduleTimerNotification = async (seconds: number) => {
    await cancelScheduledNotification();
    if (seconds <= 0) return;

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Workout Timer Complete!",
          body: "Time is up! Ready for your next set.",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
        },
      });
      notificationIdRef.current = id;
    } catch (err) {
      console.log("Error scheduling notification:", err);
    }
  };

  const playCompletionFeedback = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.log("Haptics error:", e);
    }
  };

  // Sync timer countdown with targetEndTimeRef & AppState for background/screen off persistence
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        if (!targetEndTimeRef.current) return;
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          setIsTimerRunning(false);
          targetEndTimeRef.current = null;
          playCompletionFeedback();
          cancelScheduledNotification();
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && isTimerRunning && targetEndTimeRef.current) {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          setIsTimerRunning(false);
          targetEndTimeRef.current = null;
          playCompletionFeedback();
          cancelScheduledNotification();
        }
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [isTimerRunning]);

  const handleSelectPreset = async (seconds: number) => {
    await cancelScheduledNotification();
    targetEndTimeRef.current = null;
    setSelectedPreset(seconds);
    setTimeRemaining(seconds);
    setIsTimerRunning(false);
  };

  const handleToggleTimer = async () => {
    if (isTimerRunning) {
      // Pause timer
      await cancelScheduledNotification();
      targetEndTimeRef.current = null;
      setIsTimerRunning(false);
    } else {
      // Start timer
      const duration = timeRemaining === 0 ? selectedPreset : timeRemaining;
      targetEndTimeRef.current = Date.now() + duration * 1000;
      setTimeRemaining(duration);
      setIsTimerRunning(true);
      await scheduleTimerNotification(duration);
    }
  };

  const handleResetTimer = async () => {
    await cancelScheduledNotification();
    targetEndTimeRef.current = null;
    setIsTimerRunning(false);
    setTimeRemaining(selectedPreset);
  };

  const handleAdjustTime = async (deltaSeconds: number) => {
    const newRemaining = Math.max(0, timeRemaining + deltaSeconds);
    setTimeRemaining(newRemaining);

    if (isTimerRunning) {
      if (newRemaining > 0) {
        targetEndTimeRef.current = Date.now() + newRemaining * 1000;
        await scheduleTimerNotification(newRemaining);
      } else {
        await cancelScheduledNotification();
        targetEndTimeRef.current = null;
        setIsTimerRunning(false);
        playCompletionFeedback();
      }
    }
  };

  const formatTimerText = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const padMins = String(mins).padStart(2, "0");
    const padSecs = String(secs).padStart(2, "0");
    return `${padMins}:${padSecs}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={modalStyles.backdrop}>
        <Pressable style={modalStyles.backdropPressable} onPress={onClose} />
        <View style={modalStyles.menuSheet}>
          {viewMode === "menu" && (
            <View>
              <View style={modalStyles.sheetHeader}>
                <Text style={modalStyles.sheetTitle}>Workout Options</Text>
                <Pressable onPress={onClose} hitSlop={20}>
                  <Text style={modalStyles.closeText}>X</Text>
                </Pressable>
              </View>
              {/* Option 1: Description */}
              <Pressable
                style={modalStyles.optionCard}
                onPress={() => {
                  onClose();
                  onSelectDescription();
                }}
              >
                <View style={modalStyles.optionIconBox}>
                  <Entypo name="info-with-circle" size={22} color="#f5f5f5" />
                </View>
                <View style={modalStyles.optionTextContent}>
                  <Text style={modalStyles.optionTitle}>Exercise Description</Text>
                </View>
                <Entypo name="chevron-right" size={20} color="#777" />
              </Pressable>

              {/* Option 2: Rest Timer */}
              <Pressable
                style={modalStyles.optionCard}
                onPress={() => setViewMode("timer")}
              >
                <View style={modalStyles.optionIconBox}>
                  <Entypo name="stopwatch" size={22} color="#f6a800" />
                </View>
                <View style={modalStyles.optionTextContent}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={modalStyles.optionTitle}>Timer</Text>
                    {isTimerRunning && (
                      <View style={modalStyles.runningBadge}>
                        <Text style={modalStyles.runningBadgeText}>
                          {formatTimerText(timeRemaining)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Entypo name="chevron-right" size={20} color="#777" />
              </Pressable>

              {/* Option 3: Finish Workout */}
              <Pressable
                style={[
                  modalStyles.optionCard,
                  (workoutSaved || isSaving) && modalStyles.optionCardDisabled,
                ]}
                disabled={workoutSaved || isSaving}
                onPress={() => setViewMode("confirmFinish")}
              >
                <View
                  style={[
                    modalStyles.optionIconBox,
                    workoutSaved && { backgroundColor: "#1e3a1e" },
                  ]}
                >
                  <Entypo
                    name={workoutSaved ? "check" : "controller-stop"}
                    size={22}
                    color={workoutSaved ? "#4cd964" : "#ff5252"}
                  />
                </View>
                <View style={modalStyles.optionTextContent}>
                  <Text style={modalStyles.optionTitle}>
                    {workoutSaved ? "Workout Completed" : "Finish Workout Early"}
                  </Text>
                  <Text style={modalStyles.optionSub}>
                    {workoutSaved
                      ? "All sets saved successfully"
                      : "Quit workout like a chump"}
                  </Text>
                </View>
                {!workoutSaved && (
                  <Entypo name="chevron-right" size={20} color="#777" />
                )}
              </Pressable>
            </View>
          )}

          {viewMode === "timer" && (
            <View>
              <View style={modalStyles.sheetHeader}>
                <Pressable
                  style={modalStyles.backHeaderButton}
                  onPress={() => setViewMode("menu")}
                  hitSlop={16}
                >
                  <Entypo name="chevron-left" size={30} color="#f6a800" />
                </Pressable>
                <Text style={modalStyles.sheetTitle}>Timer</Text>
                <Pressable onPress={onClose} hitSlop={20}>
                  <Text style={modalStyles.closeText}>X</Text>
                </Pressable>
              </View>

              {/* Timer Display */}
              <View style={modalStyles.timerDisplayBox}>
                <Text style={modalStyles.timerReadout}>
                  {formatTimerText(timeRemaining)}
                </Text>
                <Text style={modalStyles.timerStatusText}>
                  {timeRemaining === 0
                    ? "Time's Up!"
                    : isTimerRunning
                      ? "Resting..."
                      : "Paused"}
                </Text>
              </View>

              {/* Preset Buttons */}
              <View style={modalStyles.timerPresetRow}>
                {PRESET_TIMES.map((item) => {
                  const isActive = selectedPreset === item.seconds;
                  return (
                    <Pressable
                      key={item.label}
                      style={[
                        modalStyles.presetBtn,
                        isActive && modalStyles.presetBtnActive,
                      ]}
                      onPress={() => handleSelectPreset(item.seconds)}
                    >
                      <Text
                        style={[
                          modalStyles.presetBtnText,
                          isActive && modalStyles.presetBtnTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Timer Control Buttons */}
              <View style={modalStyles.timerControlsRow}>
                <Pressable
                  style={modalStyles.timerSecondaryBtn}
                  onPress={() => handleAdjustTime(-10)}
                >
                  <Text style={modalStyles.secondaryBtnText}>-10s</Text>
                </Pressable>

                <Pressable
                  style={modalStyles.timerMainPlayBtn}
                  onPress={handleToggleTimer}
                >
                  <Entypo
                    name={isTimerRunning ? "controller-paus" : "controller-play"}
                    size={28}
                    color="#0a0a0a"
                  />
                </Pressable>

                <Pressable
                  style={modalStyles.timerSecondaryBtn}
                  onPress={() => handleAdjustTime(30)}
                >
                  <Text style={modalStyles.secondaryBtnText}>+30s</Text>
                </Pressable>
              </View>
              <View style={modalStyles.timerControlsRow}>
                <Pressable
                  style={modalStyles.timerResetBtn}
                  onPress={handleResetTimer}
                >
                  <Entypo name="cw" size={20} color="#f5f5f5" />
                </Pressable>
              </View>
            </View>
          )}

          {viewMode === "confirmFinish" && (
            <View>
              <View style={modalStyles.sheetHeader}>
                <Pressable
                  style={modalStyles.backHeaderButton}
                  onPress={() => setViewMode("menu")}
                  hitSlop={16}
                >
                  <Entypo name="chevron-left" size={22} color="#f6a800" />
                  <Text style={modalStyles.backHeaderText}>Back</Text>
                </Pressable>
                <Text style={modalStyles.sheetTitle}>Finish Early</Text>
                <Pressable onPress={onClose} hitSlop={20}>
                  <Text style={modalStyles.closeText}>X</Text>
                </Pressable>
              </View>

              <View style={modalStyles.confirmBox}>
                <View style={modalStyles.warningIconCircle}>
                  <Entypo name="warning" size={32} color="#ff5252" />
                </View>
                <Text style={modalStyles.confirmHeading}>Finish Workout?</Text>
                <Text style={modalStyles.confirmDescription}>
                  Are you sure you want to finish this workout early? Any
                  remaining uncompleted set entries will be saved as 0 lbs.
                </Text>

                <View style={modalStyles.confirmActionsRow}>
                  <Pressable
                    style={modalStyles.confirmCancelBtn}
                    onPress={() => setViewMode("menu")}
                  >
                    <Text style={modalStyles.confirmCancelText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={modalStyles.confirmFinishBtn}
                    onPress={onFinishWorkoutEarly}
                    disabled={isSaving}
                  >
                    <Text style={modalStyles.confirmFinishText}>
                      {isSaving ? "Saving..." : "Finish & Save"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
