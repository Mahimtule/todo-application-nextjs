"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";

interface Todo {
  _id: string;
  task: string;
}

const page = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchAllTasks = async () => {
      const response = await axios.get("/api/v1/todo");
      setTodos(response.data.todos);
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <div className="border p-5 rounded-lg">
        <h1 className="text-x1 font-medium text-center mb-3">
          Todo Application
        </h1>
        <div className="flex gap-3 mb-3">
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a Task"
          />
          <Button onClick={handleSubmit}>Add</Button>
        </div>
        <div className="flex flex-col gap-3">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div key={todo._id} className="w-full border p-3 rounded-lg">
                <h1>{todo.task}</h1>
              </div>
            ))
          ) : (
            <p>No Task Found!</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default page;
