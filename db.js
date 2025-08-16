// src/db.js
import Dexie from "dexie";

export const db = new Dexie("workvaultDB");
db.version(1).stores({
  logs: "++id, title, description, project, department, date, hours, files",
});
