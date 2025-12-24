import { useState } from "react";
import AddTask from "./components/AddTask";
import Droppable from "./components/Droppable";
import CreateColumns from "./components/CreateColumns";
import TaskBar from "./components/TaskBar";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import "./App.css";

type Task = {
  task: string;
  id: string;
  status: string;
};

function App() {
  const [task, setTask] = useState<Task[]>([]);
  const [progTask, setProgTask] = useState<Task[]>([
    { id: "1", task: "do dishes", status: "stat-prog" },
    { id: "2", task: "do makeup", status: "stat-prog" },
  ]);
  const [compTask, setCompTask] = useState<Task[]>([
    { id: "4", task: "take out trash", status: "stat-comp" },
    { id: "3", task: "book appointment", status: "stat-comp" },
  ]);

  function droppingShitLogic(event: DragEndEvent) {
    const { active, over } = event;

    if (
      over &&
      over.data.current?.accepts.includes(active.data.current?.type)
    ) {
      const activeId = active.id;
      const dest = over.id;

      const statusByColumn: Record<string, Task["status"]> = {
        "todo-column": "stat-todo",
        "prog-column": "stat-prog",
        "comp-column": "stat-comp",
      };

      const nextStatus = statusByColumn[dest];

      const item =
        task.find((t) => t.id === activeId) ||
        progTask.find((t) => t.id === activeId) ||
        compTask.find((t) => t.id === activeId);

      if (!item) return;

      if (item.status === nextStatus) return;

      const moved = { ...item, status: nextStatus };

      setTask((prev) => prev.filter((t) => t.id !== activeId));
      setProgTask((prev) => prev.filter((t) => t.id !== activeId));
      setCompTask((prev) => prev.filter((t) => t.id !== activeId));

      if (dest === "todo-column") setTask((prev) => [...prev, moved]);
      if (dest === "prog-column") setProgTask((prev) => [...prev, moved]);
      if (dest === "comp-column") setCompTask((prev) => [...prev, moved]);
    }
  }

  return (
    <DndContext onDragEnd={droppingShitLogic}>
      <div className="app-container">
        <div className="colums-grid-layout">
          <Droppable id="todo-column">
            <CreateColumns status="TO DO">
              <AddTask task={task} setTask={setTask} />
            </CreateColumns>
          </Droppable>

          <Droppable id="prog-column">
            <CreateColumns status="IN PROGRESS">
              <AddTask task={progTask} setTask={setProgTask} />
            </CreateColumns>
          </Droppable>

          <Droppable id="comp-column">
            <CreateColumns status="COMPLETE">
              <AddTask task={compTask} setTask={setCompTask} />
            </CreateColumns>
          </Droppable>
        </div>
        <TaskBar task={task} setTask={setTask} />
      </div>
    </DndContext>
  );
}

export default App;
