import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";
import { weightPlateStyles as styles } from "../assets/styles/weightPlate.styles";

interface WeightPlateProps {
  weight: number;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

export const WeightPlate = ({
  weight,
  onSwipeDown,
  onSwipeUp,
}: WeightPlateProps) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const MAX_DRAG = 12;
  const SWIPE_THRESHOLD = 50;
  const VELOCITY_THRESHOLD = 500;
  const triggered = useSharedValue(false);

  const gesture = Gesture.Pan()
    .maxPointers(1)
    .onBegin(() => {
      triggered.value = false;
    })
    .onUpdate((e) => {
      const clamped = Math.max(
        -MAX_DRAG,
        Math.min(MAX_DRAG, e.translationY * 0.3),
      );
      translateY.value = clamped;

      if (!triggered.value) {
        if (
          e.translationY < -SWIPE_THRESHOLD ||
          e.velocityY < -VELOCITY_THRESHOLD
        ) {
          triggered.value = true;
          scheduleOnRN(onSwipeUp);
        } else if (
          e.translationY > SWIPE_THRESHOLD ||
          e.velocityY > VELOCITY_THRESHOLD
        ) {
          triggered.value = true;
          scheduleOnRN(onSwipeDown);
        }
      }
    })
    .onEnd(() => {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
        overshootClamping: true,
      });
    });
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.95);
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
    });

  const composed = Gesture.Simultaneous(gesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.plateWrapper}>
          <Svg
            width={80}
            height={80}
            viewBox="0 0 80 80"
            style={StyleSheet.absoluteFill}
          >
            <Circle
              cx="40"
              cy="40"
              r="38"
              fill="#f6f6f6"
              stroke="#5a5353"
              strokeWidth="4"
            />
          </Svg>
          <Text style={styles.weightText}>{weight}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};
