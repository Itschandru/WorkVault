import React, { useState, useEffect } from "react";
import { db } from "../db";
import { toast } from "react-toastify";

function AddLogForm({ onLogAdded, initialData, onSubmit, onCancel, isEdit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    department: "",
    date: "", // yyyy-mm-dd string
    hours: "",
    files: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        date:
          initialData.date instanceof Date
            ? initialData.date.toISOString().substring(0, 10)
            : initialData.date || "",
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.project.trim()) newErrors.project = "Project is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.hours || isNaN(form.hours) || Number(form.hours) <= 0)
      newErrors.hours = "Enter valid hours (> 0)";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove error as user types correctly
    setErrors((prevErrors) => {
      const copy = { ...prevErrors };
      if (
        (name === "title" || name === "project" || name === "date") &&
        value.trim() === ""
      ) {
        copy[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      } else if (name === "hours" && (isNaN(value) || Number(value) <= 0)) {
        copy.hours = "Enter valid hours (> 0)";
      } else {
        delete copy[name];
      }
      return copy;
    });
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, files: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    const logEntry = {
      ...form,
      date: new Date(form.date),
      hours: parseFloat(form.hours),
    };

    try {
      if (isEdit && onSubmit) {
        await onSubmit(logEntry);
        toast.success("Log updated successfully!");
      } else {
        await db.logs.add(logEntry);
        toast.success("Work log added successfully!");
        setForm({
          title: "",
          description: "",
          project: "",
          department: "",
          date: "",
          hours: "",
          files: [],
        });
        if (onLogAdded) onLogAdded();
      }
    } catch (error) {
      toast.error("Failed to save log: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      className="max-w-md mx-auto p-6 bg-white/90 dark:bg-gray-900 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {isEdit ? "Edit Work Log" : "Add Work Log"}
      </h2>

      {[
        { label: "Title", name: "title", type: "text", required: true },
        { label: "Project", name: "project", type: "text", required: true },
        { label: "Department", name: "department", type: "text", required: false },
        { label: "", name: "date", type: "date", required: true },
        { label: "Hours", name: "hours", type: "number", step: "0.1", min: "0.1", required: true },
      ].map(({ label, name, type, required, step, min }) => (
        <div key={name} className="relative mb-6">
          {/* Single space placeholder essential for floating label */}
          <input
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            required={required}
            step={step}
            min={min}
            placeholder=" "
            autoComplete="off"
            className={`peer w-full py-3 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border-2 outline-none shadow
              focus:bg-white focus:dark:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-150
              ${errors[name] ? "border-pink-500 focus:ring-pink-500" : "border-gray-300 dark:border-gray-700"}`}
            style={{
              /* Autofill fix */
              boxShadow: "inset 0 0 0 9999px white",
              WebkitBoxShadow: "inset 0 0 0 9999px white",
              WebkitTextFillColor: "currentColor",
            }}
          />
          <label
            htmlFor={name}
            className={`absolute left-3 top-3 text-gray-600 dark:text-gray-400 pointer-events-none transition-all
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 
              peer-focus:top-[-12px] peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400 ${
                errors[name] ? "text-pink-500 peer-focus:text-pink-500" : ""
              }`}
          >
            {label}
            {required && <span className="text-pink-500 ml-0.5">*</span>}
          </label>
          {errors[name] && (
            <p className="text-pink-600 text-sm mt-1">{errors[name]}</p>
          )}
        </div>
      ))}

      {/* Description textarea */}
      <div className="relative mb-6">
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder=" "
          rows={4}
          className="peer w-full py-3 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none shadow
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
          style={{
            boxShadow: "inset 0 0 0 9999px white",
            WebkitBoxShadow: "inset 0 0 0 9999px white",
            WebkitTextFillColor: "currentColor",
          }}
        />
        <label
          htmlFor="description"
          className="absolute left-3 top-3 text-gray-600 dark:text-gray-400 pointer-events-none transition-all
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500
            peer-focus:top-[-12px] peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400"
        >
          Description
        </label>
      </div>

      {/* File input */}
      <div className="mb-6">
        <label htmlFor="files" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Attach Proof Files:
        </label>
        <input
          id="files"
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-pink-400 file:to-blue-400
            file:text-white file:font-semibold file:px-4 file:py-2 file:shadow hover:file:bg-blue-600/90 transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition"
        >
          {isEdit ? "Update Log" : "Add Log"}
        </button>
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition font-semibold shadow-md"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddLogForm;











