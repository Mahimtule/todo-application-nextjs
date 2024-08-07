import { connectDB } from "@/utils/database";
import { Todo } from "@/models/todo";

export const GET = async (request: Request) => {
  try {
    await connectDB();
    const todos = await Todo.find();
    return new Response(JSON.stringify({ todos: todos }));
  } catch (error) {
    return new Response("Error Creating new todo", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    await connectDB();
    const { task } = await request.json();

    const newTask = await Todo.create({
      task: task,
    });

    return new Response(
      JSON.stringify({ message: "Task Created", newTask: newTask })
    );
  } catch (error) {
    console.log(error);

    return new Response("Error Creating new todo", { status: 500 });
  }
};
