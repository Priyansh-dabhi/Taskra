import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
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

type FilterKey = "all" | "pending" | "completed";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Done" },
];

export default function TasksScreen() {
  const sheetRef = useRef<AddTaskSheetHandle>(null);
  const { width: screenWidth } = useWindowDimensions();
  const { data: tasks = [], isLoading, isRefetching, refetch } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // ─── Feature 1: Filter state ──────────────────────────────────────────────
  const [filter, setFilter] = useState<FilterKey>("all");

  const filteredTasks = useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  // ─── Feature 2: Progress bar animation ────────────────────────────────────
  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : completedCount / totalCount;
  const allDone = totalCount > 0 && progress === 1;

  const barMaxWidth = screenWidth - 40; // 20px padding on each side
  const barWidth = useSharedValue(0);
  const barColorProgress = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withTiming(progress * barMaxWidth, { duration: 600 });
    barColorProgress.value = withTiming(allDone ? 1 : 0, { duration: 400 });
  }, [progress, allDone, barMaxWidth, barWidth, barColorProgress]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: barWidth.value,
    backgroundColor:
      barColorProgress.value > 0.5 ? "#4CAF50" : "#d9822b",
  }));

  // ─── Feature 3: Task counter ──────────────────────────────────────────────
  const pendingCount = useMemo(
    () => tasks.filter((t) => !t.completed).length,
    [tasks]
  );

  // ─── Handlers (untouched) ─────────────────────────────────────────────────
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

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your tasks</Text>
        <Text style={styles.heroSubtitle}>
          Keep the list lean, then ship your day.
        </Text>
      </View>

      {/* Feature 3: Task counter badge */}
      <View style={styles.badgeWrap}>
        {pendingCount === 0 && totalCount > 0 ? (
          <Text style={styles.badgeAllDone}>🎉 All tasks done!</Text>
        ) : totalCount > 0 ? (
          <Text style={styles.badgePending}>
            {pendingCount} {pendingCount === 1 ? "task" : "tasks"} remaining
          </Text>
        ) : null}
      </View>

      {/* Feature 1: Filter tabs */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map(({ key, label }) => (
          <Pressable
            key={key}
            onPress={() => setFilter(key)}
            style={[
              styles.filterTab,
              filter === key && styles.filterTabActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === key && styles.filterTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Feature 2: Progress bar */}
      {totalCount > 0 && (
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            {completedCount} of {totalCount} completed
          </Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressBarStyle]} />
          </View>
        </View>
      )}

      {/* Task list */}
      {isLoading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color="#d9822b" />
          <Text style={styles.stateText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
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
            filteredTasks.length === 0 && styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => void refetch()}
              tintColor="#d9822b"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {filter === "all"
                  ? "No tasks yet"
                  : filter === "pending"
                    ? "No pending tasks"
                    : "No completed tasks"}
              </Text>
              <Text style={styles.emptyText}>
                {filter === "all"
                  ? "Tap the add button to create your first task."
                  : "Try switching filters."}
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => sheetRef.current?.expand()}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Bottom sheet */}
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

  /* ── Hero ── */
  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
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

  /* ── Feature 3: Task counter badge ── */
  badgeWrap: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    minHeight: 28,
  },
  badgeAllDone: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4CAF50",
  },
  badgePending: {
    fontSize: 13,
    fontWeight: "600",
    color: "#627d98",
  },

  /* ── Feature 1: Filter tabs ── */
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d9e2ec",
  },
  filterTabActive: {
    backgroundColor: "#d9822b",
    borderColor: "#d9822b",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#627d98",
  },
  filterTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },

  /* ── Feature 2: Progress bar ── */
  progressSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#627d98",
    marginBottom: 8,
  },
  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 10,
    backgroundColor: "#d9e2ec",
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 10,
  },

  /* ── Loading state ── */
  stateWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stateText: {
    marginTop: 12,
    color: "#486581",
  },

  /* ── Task list ── */
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

  /* ── FAB ── */
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
