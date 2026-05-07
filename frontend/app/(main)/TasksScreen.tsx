import React, { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddTaskSheet, {
  type AddTaskSheetHandle,
} from "../../src/components/AddTaskSheet";
import TaskCard from "../../src/components/TaskCard";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "../../src/hooks/useTasks";

export default function TasksScreen() {
  const sheetRef = useRef<AddTaskSheetHandle>(null);
  const { data: tasks = [], isLoading, isRefetching, refetch } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleCreateTask = async (title: string, description: string) => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a title for your task.");
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create task";
      Alert.alert("Create failed", message);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        completed: true,
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
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
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
        onPress={() => sheetRef.current?.expand()}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <AddTaskSheet
        ref={sheetRef}
        onSubmit={handleCreateTask}
        isSubmitting={createTaskMutation.isPending}
      />
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
    zIndex: 20,
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
});
