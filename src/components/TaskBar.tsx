import React, { useEffect, useState } from "react";
import "./TaskBar.css";

type Task = {
  task: string;
  id: string;
  status: string;
};

type TaskBarProps = {
  task: Task[];
  setTask: React.Dispatch<React.SetStateAction<Task[]>>;
};

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

export default TaskBar;
