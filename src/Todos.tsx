import { useEffect, useState } from "react";
import axios from "axios";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
};

export const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [quickText, setQuickText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(null);

  // Estados para el modal de nueva tarea
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/todos")
      .then((res) => setTodos(res.data));
  }, []);

  // Añadir tarea rápida (solo título)
  const addQuickTodo = () => {
    if (!quickText.trim()) return;
    axios
      .post("http://localhost:4000/api/todos", { title: quickText })
      .then((res) => {
        setTodos([...todos, res.data]);
        setQuickText("");
      });
  };

  // Añadir tarea con título y descripción
  const addFullTodo = () => {
    if (!newTodoTitle.trim()) return;
    axios
      .post("http://localhost:4000/api/todos", {
        title: newTodoTitle,
        description: newTodoDescription,
      })
      .then((res) => {
        setTodos([...todos, res.data]);
        setNewTodoTitle("");
        setNewTodoDescription("");
        setShowNewModal(false);
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

  // Editar tarea (solo título)
  const handleEdit = (id: number, currentText: string, e: React.MouseEvent) => {
    setEditingId(id);
    setEditingTitle(currentText);
    setModalPos({ x: e.clientX, y: e.clientY });
  };

  // Nueva función para abrir el modal de edición con datos previos
  const openEditModal = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingDescription(todo.description || "");
  };

  // Guardar cambios de edición
  const handleEditSave = () => {
    if (!editingTitle.trim() || editingId === null) return;
    axios
      .put(`http://localhost:4000/api/todos/${editingId}`, {
        title: editingTitle,
        description: editingDescription,
      })
      .then((res) => {
        setTodos(todos.map((t) => (t.id === editingId ? res.data : t)));
        setEditingId(null);
        setEditingTitle("");
        setEditingDescription("");
      });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingDescription("");
  };

  // Contadores
  const completedCount = todos.filter((t) => t.completed).length;
  const uncompletedCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#18191A] flex items-center justify-center p-6 relative">
      {/* Contenedor principal */}
      <div className="w-full max-w-lg bg-[#242526] rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-white tracking-tight">
          Hoy
        </h1>
        {/* Contadores */}
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
        <button
          className="w-full mb-6 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
          onClick={() => setShowNewModal(true)}
        >
          Nueva Tarea
        </button>
        {/* Lista de tareas */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col bg-[#242526] border border-[#3A3B3C] rounded-lg px-4 py-3 group hover:border-blue-600 transition"
            >
              <div className="flex items-center">
                {/* Botón completar */}
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
                {/* Título tarea */}
                <span
                  onDoubleClick={() => openEditModal(todo)}
                  className={`flex-1 cursor-pointer select-none text-lg transition
                    ${todo.completed ? "line-through text-gray-500" : "text-white"}
                  `}
                  title="Doble click para editar"
                >
                  {todo.title}
                </span>
                {/* Botón eliminar */}
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
              </div>
              {/* Descripción */}
              {todo.description && (
                <div
                  className="ml-9 mt-1 text-gray-300 text-sm whitespace-pre-line cursor-pointer"
                  title="Doble click para editar"
                  onDoubleClick={() => openEditModal(todo)}
                >
                  {todo.description}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Modal edición */}
      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#242526] border border-[#3A3B3C] rounded-xl shadow-xl p-8 w-[40rem] max-w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">Actualizar Tarea</h2>
            <input
              className="w-full bg-[#3A3B3C] text-white px-4 py-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={editingTitle}
              onChange={e => setEditingTitle(e.target.value)}
              placeholder="Título"
              autoFocus
            />
            <textarea
              className="w-full bg-[#3A3B3C] text-white px-4 py-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              value={editingDescription}
              onChange={e => setEditingDescription(e.target.value)}
              placeholder="Descripción"
              rows={6}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-base flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-base flex-1"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Nueva Tarea */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#242526] border border-[#3A3B3C] rounded-xl shadow-xl p-8 w-[40rem] max-w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">Nueva Tarea</h2>
            <input
              type="text"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              placeholder="Título de la tarea"
              className="w-full bg-[#3A3B3C] text-white px-4 py-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <textarea
              value={newTodoDescription}
              onChange={e => setNewTodoDescription(e.target.value)}
              placeholder="Descripción de la tarea"
              className="w-full bg-[#3A3B3C] text-white px-4 py-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              rows={6}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewModal(false);
                  setNewTodoTitle("");
                  setNewTodoDescription("");
                }}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-base flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={addFullTodo}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-base flex-1"
              >
                Guardar Tarea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
