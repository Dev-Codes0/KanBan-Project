import React, { useEffect, useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./App.css";

type CreateColumnsProps = {
  status: string;
  children?: ReactNode;
};

type Task = {
  task: string;
  id: string;
};

type TaskBarProps = {
  task: Task[];
  setTask: React.Dispatch<React.SetStateAction<Task[]>>;
};

type AddTaskProps = {
  task: Task[];
};

type SortableItemProps = {
  id: string;
  children: ReactNode;
};

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="task-layout"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

function CreateColumns({ status, children }: CreateColumnsProps) {
  return (
    <div>
      <p className="">{status}</p>
      <div className="colum-layout">{children}</div>
    </div>
  );
}

function AddTask({ task }: AddTaskProps) {
  return (
    <>
      {task.map((data) => {
        return (
          <SortableItem key={data.id} id={data.id}>
            {data.task}
          </SortableItem>
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveId(active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setTask((items) => {
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app-container">
        <div className="colums-grid-layout">
          <CreateColumns status="TO DO">
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={task}
            >
              <AddTask task={task} />
            </SortableContext>
          </CreateColumns>
          <CreateColumns status="IN PROGRESS" />
          <CreateColumns status="COMPLETE" />
        </div>
        <TaskBar task={task} setTask={setTask} />
      </div>
    </DndContext>
  );
}

export default App;
