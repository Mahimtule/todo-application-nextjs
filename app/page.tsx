"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Trash, Pen, X, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Todo {
  _id: string;
  task: string;
}

const Page = () => {
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await axios.get("/api/v1/todo");
        setTodos(response.data.todos);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTasks();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/todo", {
        task: task,
      });
      setTodos([...todos, response.data.newTask]);
      setTask("");
      toast({
        title: "Task Created Successfully",
        description: "Your Task have been added",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.put(`/api/v1/todo/${id}`, {
        task: editTask,
      });

      setTodos(
        todos.map((todo) =>
          todo._id === id
            ? { ...todo, task: response.data.updatedTask.task }
            : todo
        )
      );
      setEditTask("");
      setEditingId(null);
      toast({
        title: "Task Updated Successfully",
        description: "Your Task Have been Updated.",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/v1/todo/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast({
        title: "Task Deleted Successfully",
        description: "Your Task Have been Deleted.",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <div className="border p-5 rounded-lg">
        <h1 className="text-xl font-medium text-center mb-3">
          Todo Application
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-3 mb-3">
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            required
          />
          <Button type="submit">Add</Button>
        </form>
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col items-start gap-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ) : todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo._id}
                className="w-full flex justify-between items-center border p-3 rounded-lg"
              >
                {editingId === todo._id ? (
                  <Input
                    className="mr-3"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                  />
                ) : (
                  <h1>{todo.task}</h1>
                )}

                <div className="flex justify-center items-center gap-2">
                  {editingId === todo._id ? (
                    <>
                      <Button
                        onClick={() => handleUpdate(todo._id)}
                        size="icon"
                      >
                        <Check width={16} height={16} />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(null);
                          setEditTask("");
                        }}
                        size="icon"
                      >
                        <X width={16} height={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleDelete(todo._id)}
                        size="icon"
                      >
                        <Trash width={16} height={16} />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(todo._id);
                          setEditTask(todo.task);
                        }}
                        size="icon"
                      >
                        <Pen width={16} height={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No tasks found</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
