import React, { useState } from "react";
import Draggable from "./Draggable";
import editImage from "../assets/edit.png";
import confirmImage from "../assets/confirmation.png";
import deleteImage from "../assets/delete.png";
import "./AddTask.css";

type Task = {
  task: string;
  id: string;
  status: string;
};

type AddTaskProps = {
  task: Task[];
  setTask: React.Dispatch<React.SetStateAction<Task[]>>;
};

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

export default AddTask;
