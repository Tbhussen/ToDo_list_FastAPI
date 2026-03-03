"use client";
import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/todos`)
      .then((r) => r.json())
      .then((data: TodoItem[]) => {
        setTodos(data);
        setLoading(false);
      });
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const newTodo: TodoItem = await res.json();
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = async (id: string) => {
    const res = await fetch(`${API}/api/todos/${id}`, { method: "PATCH" });
    const updated: TodoItem = await res.json();
    setTodos(todos.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTodo = async (id: string) => {
    await fetch(`${API}/api/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">✅ My Todos</h1>
        <p className="text-sm text-gray-400 mb-6">Powered by FastAPI + Next.js</p>

        {/* Input Row */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
          />
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            onClick={addTodo}
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        {loading ? (
          <p className="text-center text-gray-400 text-sm">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No tasks yet. Add one above!</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-3"
              >
                <span
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-1 text-sm cursor-pointer select-none ${
                    todo.done ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {todo.done ? "☑" : "☐"} {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-3 text-gray-300 hover:text-red-400 transition-colors text-base"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
