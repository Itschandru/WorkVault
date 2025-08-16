// src/components/LogList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../db";
import AddLogForm from "./AddLogForm";
import { toast } from "react-toastify";

function LogList() {
  const [logs, setLogs] = useState([]);
  const [editingLog, setEditingLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const allLogs = await db.logs.toArray();
    allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    setLogs(allLogs);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this log entry?")) {
      await db.logs.delete(id);
      toast.success("Log deleted");
      fetchLogs();
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
  };

  const handleCancel = () => {
    setEditingLog(null);
  };

  const handleUpdate = async (updatedLog) => {
    await db.logs.update(updatedLog.id, updatedLog);
    setEditingLog(null);
    toast.success("Log updated");
    fetchLogs();
  };

  if (editingLog) {
    return (
      <AddLogForm
        initialData={editingLog}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        isEdit
      />
    );
  }

  if (logs.length === 0) {
    return <p className="text-center text-gray-600 dark:text-gray-300 mt-6">No work logs found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">Your Work Logs</h2>
      <ul>
        {logs.map((log) => (
          <li
            key={log.id}
            className="bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg shadow-lg rounded-xl p-6 mb-6 border border-white/30 dark:border-gray-700 flex justify-between items-start group transition-all hover:shadow-2xl hover:scale-[1.02]"
          >
            <div>
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-1">{log.title}</h3>
              <p className="text-gray-800 dark:text-gray-200"><span className="font-semibold">Project:</span> {log.project}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <span className="font-semibold">Department:</span> {log.department || "N/A"}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(log.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <span className="font-semibold">Hours:</span> {log.hours}
              </p>
              {log.description && (
                <p className="mt-3 text-gray-700 dark:text-gray-300">{log.description}</p>
              )}
            </div>
            <div className="flex flex-col gap-3 ml-4">
              <button
                onClick={() => handleEdit(log)}
                className="py-2 px-5 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded shadow font-semibold hover:scale-105 transition transform"
                aria-label={`Edit work log titled ${log.title}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(log.id)}
                className="py-2 px-5 bg-gradient-to-br from-pink-400 to-red-600 text-white rounded shadow font-semibold hover:scale-105 transition transform"
                aria-label={`Delete work log titled ${log.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LogList;


