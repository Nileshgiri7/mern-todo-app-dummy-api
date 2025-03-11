import { useEffect, useState } from "react";
import useAutoLogout from "../hooks/useAutoLogout";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import TaskList from "../components/TaskList";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const { warningVisible, timeLeft, stayLoggedIn, logout } = useAutoLogout();
  const userId = Cookies.get("userID");
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `https://dummyjson.com/todos/user/${userId}`
      );
      const data = await response.json();
      setTasks(data.todos);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://dummyjson.com/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: title,
          completed: false,
          userId,
        }),
      });

      const newTask = await response.json();
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setTitle("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center ">
      <h1 className="mb-4">Task Manager</h1>
      <div className="card p-4 shadow" style={{ width: "500px" }}>
        <form onSubmit={handleCreateTask}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter new task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Add Task
          </button>
        </form>
      </div>

      <div className="mt-4 w-100">
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
      <div className="mt-4">
        {!warningVisible && (
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        )}
      </div>

      {warningVisible && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Session Expiring!</h5>
              </div>
              <div className="modal-body">
                <p>
                  You will be logged out in <strong>{timeLeft} seconds</strong>{" "}
                  due to inactivity.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={stayLoggedIn}>
                  Stay Logged In
                </button>
                <button className="btn btn-danger" onClick={logout}>
                  Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
