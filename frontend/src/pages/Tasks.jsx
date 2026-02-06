import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    const decoded = jwtDecode(token);
    setUser(decoded);

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await API.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      completed: !task.completed,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          To-Do App Dashboard
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="bg-white text-purple-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* 👤 PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-lg">
                {user?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-indigo-100 rounded-lg p-2">
              <p className="font-bold">{tasks.length}</p>
              <p>Total</p>
            </div>
            <div className="bg-green-100 rounded-lg p-2">
              <p className="font-bold">{completedCount}</p>
              <p>Done</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-2">
              <p className="font-bold">{pendingCount}</p>
              <p>Pending</p>
            </div>
          </div>
        </motion.div>

        {/* 📋 TASK PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6"
        >
          <form onSubmit={addTask} className="flex gap-2 mb-4">
            <input
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="bg-purple-600 text-white px-4 rounded-lg">
              Add
            </button>
          </form>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg ${
                  filter === f
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Tasks */}
          <ul className="space-y-2">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.li
                  key={task._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                    />
                    <span
                      className={
                        task.completed
                          ? "line-through text-gray-400"
                          : ""
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default Tasks;
