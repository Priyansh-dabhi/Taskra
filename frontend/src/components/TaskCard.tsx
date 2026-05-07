import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../api/tasks";

interface TaskCardProps {
  task: Task;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({
  task,
  isUpdating = false,
  isDeleting = false,
  onToggleComplete,
  onDelete,
}: TaskCardProps) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onToggleComplete(task)}
        style={styles.content}
        disabled={isUpdating || isDeleting}
      >
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed ? <Text style={styles.checkboxMark}>✓</Text> : null}
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.title, task.completed && styles.titleDone]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text
              style={[
                styles.description,
                task.completed && styles.descriptionDone,
              ]}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </Pressable>

      <Pressable
        onPress={() => onDelete(task._id)}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.deleteButtonPressed,
        ]}
        disabled={isDeleting}
      >
        <Text style={styles.deleteText}>{isDeleting ? "..." : "Delete"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    marginBottom: 12,
    shadowColor: "#102a43",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#1f7a8c",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
    backgroundColor: "#ffffff",
  },
  checkboxChecked: {
    backgroundColor: "#1f7a8c",
  },
  checkboxMark: {
    color: "#ffffff",
    fontWeight: "700",
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
    color: "#627d98",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#486581",
    lineHeight: 20,
  },
  descriptionDone: {
    color: "#829ab1",
  },
  deleteButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff1f2",
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteText: {
    color: "#b23a48",
    fontWeight: "600",
  },
});
