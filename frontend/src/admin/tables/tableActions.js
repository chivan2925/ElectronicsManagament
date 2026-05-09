import { Eye, Pencil, Trash2 } from "lucide-react";

export const ADMIN_TABLE_ACTIONS = Object.freeze([
  { icon: Eye, key: "view", title: "Xem" },
  { icon: Pencil, key: "update", title: "Sửa", tone: "warning" },
  { icon: Trash2, key: "delete", title: "Xóa", tone: "danger" },
]);
