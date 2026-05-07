import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Task } from "../api/tasks";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

/**
 * Swipe-able task card inspired by iOS Mail / Todoist.
 *
 *  ➡️  Right swipe → green "Done" action  (renderLeftActions)
 *  ⬅️  Left swipe  → red  "Delete" action (renderRightActions)
 */
export default function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const swipeableRef = useRef<Swipeable>(null);

  /* ---------- Right swipe → Complete ---------- */
  const renderLeftActions = useCallback(
    (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
      const scale = dragX.interpolate({
        inputRange: [0, 80],
        outputRange: [0.4, 1],
        extrapolate: "clamp",
      });

      const opacity = dragX.interpolate({
        inputRange: [0, 60, 80],
        outputRange: [0, 0.6, 1],
        extrapolate: "clamp",
      });

      return (
        <Animated.View style={[styles.action, styles.completeAction, { opacity }]}>
          <Animated.View style={[styles.actionInner, { transform: [{ scale }] }]}>
            <Ionicons name="checkmark-circle" size={26} color="#ffffff" />
            <Text style={styles.actionText}>Done</Text>
          </Animated.View>
        </Animated.View>
      );
    },
    [],
  );

  /* ---------- Left swipe → Delete ---------- */
  const renderRightActions = useCallback(
    (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
      const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0.4],
        extrapolate: "clamp",
      });

      const opacity = dragX.interpolate({
        inputRange: [-80, -60, 0],
        outputRange: [1, 0.6, 0],
        extrapolate: "clamp",
      });

      return (
        <Animated.View style={[styles.action, styles.deleteAction, { opacity }]}>
          <Animated.View style={[styles.actionInner, { transform: [{ scale }] }]}>
            <Ionicons name="trash-outline" size={26} color="#ffffff" />
            <Text style={styles.actionText}>Delete</Text>
          </Animated.View>
        </Animated.View>
      );
    },
    [],
  );

  /* ---------- Fire mutation when swipe fully opens ---------- */
  const handleSwipeOpen = useCallback(
    (direction: "left" | "right") => {
      if (direction === "left") {
        // renderLeftActions was revealed → user swiped right → Complete
        onComplete(task._id);
      } else {
        // renderRightActions was revealed → user swiped left → Delete
        onDelete(task._id);
      }

      // Close the drawer after the action fires
      swipeableRef.current?.close();
    },
    [task._id, onComplete, onDelete],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      overshootFriction={8}
      leftThreshold={80}
      rightThreshold={80}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleSwipeOpen}
    >
      <View style={[styles.card, task.completed && styles.cardCompleted]}>
        <View style={styles.textWrap}>
          <Text
            style={[styles.title, task.completed && styles.titleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text
              style={[styles.description, task.completed && styles.descriptionDone]}
              numberOfLines={3}
            >
              {task.description}
            </Text>
          ) : null}
        </View>

        {task.completed && (
          <View style={styles.badge}>
            <Ionicons name="checkmark-done" size={16} color="#1f9d55" />
          </View>
        )}
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  /* ---- Card ---- */
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#102a43",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#102a43",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#6b7c93",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: "#486581",
  },
  descriptionDone: {
    color: "#8a9aad",
  },
  badge: {
    marginLeft: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e6f7ee",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ---- Swipe action backgrounds ---- */
  action: {
    flex: 1,
    marginBottom: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionInner: {
    alignItems: "center",
    gap: 4,
  },
  completeAction: {
    backgroundColor: "#1f9d55",
  },
  deleteAction: {
    backgroundColor: "#d64545",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
});
