import { useEffect, useState } from "react";
import axios from "axios";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/todos")
      .then((res) => setTodos(res.data));
  }, []);

  const addTodo = () => {
    if (!text.trim()) return;
    axios.post("http://localhost:4000/api/todos", { text }).then((res) => {
      setTodos([...todos, res.data]);
      setText("");
    });
  };

  const toggleTodo = (id: number, completed: boolean) => {
    axios
      .put(`http://localhost:4000/api/todos/${id}`, { completed: !completed })
      .then((res) => {
        setTodos(todos.map((t) => (t.id === id ? res.data : t)));
      });
  };

  const deleteTodo = (id: number) => {
    axios.delete(`http://localhost:4000/api/todos/${id}`).then(() => {
      setTodos(todos.filter((t) => t.id !== id));
    });
  };

  // Editar tarea
  const handleEdit = (id: number, currentText: string, e: React.MouseEvent) => {
    setEditingId(id);
    setEditingText(currentText);
    // Posición del modal cerca del mouse
    setModalPos({ x: e.clientX, y: e.clientY });
  };

  const handleEditSave = () => {
    if (!editingText.trim() || editingId === null) return;
    axios
      .put(`http://localhost:4000/api/todos/${editingId}`, { text: editingText })
      .then((res) => {
        setTodos(todos.map((t) => (t.id === editingId ? res.data : t)));
        setEditingId(null);
        setEditingText("");
        setModalPos(null);
      });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText("");
    setModalPos(null);
  };

  // Contadores de tareas completadas y no completadas
  const completedCount = todos.filter((t) => t.completed).length;
  const uncompletedCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#18191A] flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg bg-[#242526] rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-white tracking-tight">
          Hoy
        </h1>
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span className="text-white text-sm">
              Completadas: {completedCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
            <span className="text-white text-sm">
              Pendientes: {uncompletedCount}
            </span>
          </div>
        </div>
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-1 bg-[#3A3B3C] border-none rounded-l-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Añadir tarea..."
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-blue-700 transition"
          >
            +
          </button>
        </div>
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center bg-[#242526] border border-[#3A3B3C] rounded-lg px-4 py-3 group hover:border-blue-600 transition"
            >
              <button
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className={`w-5 h-5 mr-4 rounded-full border-2 flex-shrink-0 transition
                ${todo.completed
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-500 bg-transparent hover:border-blue-400"}
              `}
                aria-label="Completar"
              >
                {todo.completed && (
                  <svg
                    className="w-3 h-3 text-white mx-auto my-auto"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span
                onDoubleClick={(e) => handleEdit(todo.id, todo.text, e)}
                className={`flex-1 cursor-pointer select-none text-lg transition
                ${todo.completed ? "line-through text-gray-500" : "text-white"}
              `}
                title="Doble click para editar"
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-4 text-red-500 hover:text-red-700 opacity-70 hover:opacity-100 transition"
                aria-label="Eliminar"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Mini modal flotante para edición */}
      {editingId !== null && modalPos && (
        <div
          className="fixed z-50 bg-[#242526] border border-[#3A3B3C] rounded-xl shadow-xl p-4 flex flex-col gap-3"
          style={{
            top: modalPos.y + 10,
            left: modalPos.x - 100,
            minWidth: 220,
          }}
        >
          <input
            className="bg-[#3A3B3C] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") handleEditCancel();
            }}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleEditCancel}
              className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleEditSave}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
