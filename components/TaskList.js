const TaskList = ({ tasks, setTasks }) => {
  const handleDelete = async (taskId) => {
    try {
      await fetch(`https://dummyjson.com/todos/${taskId}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async (taskId, completed) => {
    try {
      const response = await fetch(`https://dummyjson.com/todos/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <ul className="list-group">
      {tasks.map((task, index) => (
        <li
          key={task.id || `task-${index}`} // ✅ Ensure unique key
          className="list-group-item d-flex justify-content-between align-items-center"
          style={{ height: "50px", overflow: "hidden" }}
        >
          <span className="text-truncate w-75">{task.todo}</span>
          <div>
            <button
              className={`btn btn-${task.completed ? "secondary" : "primary"} btn-sm me-2`}
              onClick={() => handleUpdate(task.id, task.completed)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
