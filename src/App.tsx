import React, { useEffect, useState, type ReactNode } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import editImage from "./assets/edit.png";
import confirmImage from "./assets/confirmation.png";
import deleteImage from "./assets/delete.png";
import "./App.css";

type CreateColumnsProps = {
  status: string;
  children?: ReactNode;
};

type Task = {
  task: string;
  id: string;
  status: string;
};

type TaskBarProps = {
  task: Task[];
  setTask: React.Dispatch<React.SetStateAction<Task[]>>;
};

type AddTaskProps = {
  task: Task[];
  setTask: React.Dispatch<React.SetStateAction<Task[]>>;
};

type DroppableProps = {
  id: string;
  children: ReactNode;
};

type DraggleProps = {
  children: ReactNode;
  id: string;
  status: string;
};

function Draggable({ children, id, status }: DraggleProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type: status },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      accepts: ["stat-todo", "stat-prog", "stat-comp"],
    },
  });

  return <div ref={setNodeRef}>{children}</div>;
}

function CreateColumns({ status, children }: CreateColumnsProps) {
  return (
    <div>
      <p>{status}</p>
      <div className="colum-layout">{children}</div>
    </div>
  );
}

function AddTask({ task, setTask }: AddTaskProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");

  function handleEditClick(id: string) {
    setEditingId((prev) => (prev === id ? null : id));
  }

  function saveNewTask(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function passTask(taskId: string) {
    setTask((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, task: newTask } : t)),
    );
    setEditingId(null);
  }

  function deleteTask(taskIdtoDelete: string) {
    setTask((prev) => prev.filter((t) => t.id !== taskIdtoDelete));
  }

  return (
    <>
      {task.map((data) => {
        const isCheck = editingId === data.id;

        return (
          <Draggable id={data.id} key={data.id} status={data.status}>
            <div className="task-layout">
              {isCheck ? (
                <div className="change-area">
                  <input
                    className="change-input"
                    onChange={saveNewTask}
                    value={newTask}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <button
                    className="confirm-button"
                    onClick={() => passTask(data.id)}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <img className="confirm-image" src={confirmImage} />
                  </button>
                </div>
              ) : (
                <div className="inner-layout">
                  <div className="t">{data.task}</div>
                  <div className="t2">
                    <button
                      onClick={() => handleEditClick(data.id)}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="edit-button"
                    >
                      <img className="edit-image" src={editImage} />
                    </button>
                    <button
                      className="delete-button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => deleteTask(data.id)}
                    >
                      <img className="delete-image" src={deleteImage} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Draggable>
        );
      })}
    </>
  );
}

function TaskBar({ task, setTask }: TaskBarProps) {
  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function getInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);
  }

  function addTaskToPage() {
    setTask([
      ...task,
      {
        task: input,
        id: crypto.randomUUID(),
        status: "stat-todo",
      },
    ]);
    setIsOpen(false);
  }

  function shortCuts(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      addTaskToPage();
    }
  }

  useEffect(() => {
    function closeShortCut(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", closeShortCut);
    }

    return () => {
      window.removeEventListener("keydown", closeShortCut);
    };
  }, [isOpen]);

  function popUp() {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }

  return (
    <div>
      <div className="task-position-layout">
        <div className="name-on-task">Hello, Kevin</div>
        <div>
          <button onClick={popUp} className="create-task-button">
            Create Task
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="popup-position-layout">
          <div className="popup-flex-layout">
            <input
              size={30}
              onKeyDown={shortCuts}
              className="input-bar"
              onChange={getInput}
              placeholder="Add task"
            />

            <div>
              <button className="add-button" onClick={addTaskToPage}>
                Add
              </button>
              <button className="close-button" onClick={popUp}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
