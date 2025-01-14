import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, deleteTask, updateTask, currentUserRole }) => {
  return (
    <div className="container mt-4">
      {tasks.length === 0 ? (
        <div className="alert alert-info">No tasks yet</div>
      ) : (
        <div className="list-group">
          {tasks.map((task) => (
            <TaskItem
              key={task._id} // Changed from task.id to task._id
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              currentUserRole={currentUserRole}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;