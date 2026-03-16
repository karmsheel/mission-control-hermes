import { TaskProvider } from "@/lib/TaskContext";
import TaskBoard from "@/components/TaskBoard";

export default function Home() {
  return (
    <TaskProvider>
      <TaskBoard />
    </TaskProvider>
  );
}
