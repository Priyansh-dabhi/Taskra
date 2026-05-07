import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Task } from "../../src/api/tasks";
import TaskCard from "../../src/components/TaskCard";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "../../src/hooks/useTasks";

export default function TasksScreen() {
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: tasks = [], isLoading, isRefetching, refetch } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a title for your task.");
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
      setIsComposerVisible(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create task";
      Alert.alert("Create failed", message);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task._id,
        completed: !task.completed,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update task";
      Alert.alert("Update failed", message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete task";
      Alert.alert("Delete failed", message);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your tasks</Text>
        <Text style={styles.heroSubtitle}>
          Keep the list lean, then ship your day.
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color="#1f7a8c" />
          <Text style={styles.stateText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              isUpdating={updateTaskMutation.isPending}
              isDeleting={deleteTaskMutation.isPending}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            tasks.length === 0 && styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => void refetch()}
              tintColor="#1f7a8c"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No tasks yet</Text>
              <Text style={styles.emptyText}>
                Tap the add button to create your first task.
              </Text>
            </View>
          }
        />
      )}

      <Pressable
        onPress={() => setIsComposerVisible(true)}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal
        visible={isComposerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsComposerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New task</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              style={styles.input}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              multiline
              style={[styles.input, styles.textArea]}
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setIsComposerVisible(false)}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleCreateTask()}
                style={styles.primaryButton}
                disabled={createTaskMutation.isPending}
              >
                <Text style={styles.primaryButtonText}>
                  {createTaskMutation.isPending ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7f5",
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#102a43",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#486581",
  },
  stateWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stateText: {
    marginTop: 12,
    color: "#486581",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#102a43",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#627d98",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 28,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d9822b",
    shadowColor: "#102a43",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.92,
  },
  fabText: {
    fontSize: 34,
    lineHeight: 36,
    color: "#ffffff",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(16, 42, 67, 0.25)",
  },
  modalCard: {
    padding: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#ffffff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#102a43",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d9e2ec",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#102a43",
    backgroundColor: "#f8fbff",
    marginBottom: 12,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#eef2f6",
  },
  secondaryButtonText: {
    color: "#486581",
    fontWeight: "700",
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#1f7a8c",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
