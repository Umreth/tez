"use client";

import { useState, useEffect } from "react";

type Task = {
  id: string;
  text: string;
  date: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!newTaskText.trim() || !selectedDate) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      date: selectedDate,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTaskText("");
  }

  function toggleComplete(id: string) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTask(id: string) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(tasksByDate).sort();

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24 }}>My To-Do List</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          style={{ flex: 1, minWidth: 200, padding: "8px 12px", fontSize: 16, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: "8px 12px", fontSize: 16, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button
          onClick={addTask}
          style={{ padding: "8px 16px", fontSize: 16, backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Add Task
        </button>
      </div>

      {sortedDates.length === 0 && (
        <p style={{ color: "#888" }}>No tasks yet. Add one above!</p>
      )}

      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 4 }}>
            {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {tasksByDate[date].map((task) => (
              <li key={task.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                <span style={{ flex: 1, fontSize: 16, textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#999" : "#000" }}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: "4px 10px", fontSize: 14, backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
