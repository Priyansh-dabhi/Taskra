import client from "./client";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  success: true;
  data: Task[];
}

interface TaskResponse {
  success: true;
  data: Task;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  return fallback;
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await client.get<TasksResponse>("/tasks");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load tasks"));
  }
};

export const createTask = async (payload: CreateTaskInput): Promise<Task> => {
  try {
    const response = await client.post<TaskResponse>("/tasks", payload);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create task"));
  }
};

export const updateTask = async ({
  id,
  ...payload
}: UpdateTaskInput): Promise<Task> => {
  try {
    const response = await client.patch<TaskResponse>(`/tasks/${id}`, payload);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update task"));
  }
};

export const deleteTask = async (id: string): Promise<Task> => {
  try {
    const response = await client.delete<TaskResponse>(`/tasks/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete task"));
  }
};
