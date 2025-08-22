import React from "react";

const TaskSearch = ({ search, setSearch }) => {
  return (
    <div className="task-search">
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default TaskSearch;
