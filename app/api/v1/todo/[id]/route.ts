import { connectDB } from "@/utils/database";
import { Todo } from "@/models/todo";

interface Props {
  id: string;
}

export const DELETE = async (
  request: Request,
  { params }: { params: Props }
) => {
  try {
    await connectDB();
    const task = await Todo.findById(params.id);
    if (!task)
      return new Response("No Task Found with this Id", { status: 400 });

    const deletedTask = await Todo.findByIdAndDelete(params.id);
    return new Response(
      JSON.stringify({
        message: "Task Deleted Successfully.",
        deletedTask: deletedTask,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Delete Error: ", error);
    return new Response("Error Deleting Task!!", { status: 500 });
  }
};

export const PUT = async (request: Request, { params }: { params: Props }) => {
  try {
    const { task } = await request.json();

    if (!task) return new Response("Task is Missing!", { status: 400 });

    const updatedTask = await Todo.findByIdAndUpdate(
      params.id,
      {
        task: task,
      },
      { new: true }
    );

    return new Response(
      JSON.stringify({
        message: "Task Updated",
        updatedTask: updatedTask,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Error Updating Task!!", { status: 500 });
  }
};
