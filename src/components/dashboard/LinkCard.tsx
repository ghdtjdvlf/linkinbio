"use client";

import { useState } from "react";
import { GripVertical, Pencil, Trash2, BarChart2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { LinkItem } from "@/types";

interface LinkCardProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export default function LinkCard({ link, onEdit, onDelete, onToggleActive }: LinkCardProps) {
  const [deleting, setDeleting] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    setDeleting(true);
    onDelete(link.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {link.icon && <span className="text-lg">{link.icon}</span>}
          <p className="font-medium text-gray-900 truncate dark:text-white">{link.title}</p>
        </div>
        <p className="text-xs text-gray-500 truncate dark:text-gray-400">{link.url}</p>
        {link._count !== undefined && (
          <p className="mt-1 flex items-center gap-1 text-xs text-indigo-500">
            <BarChart2 className="h-3 w-3" />
            {link._count.clicks} clicks
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Toggle
          checked={link.active}
          onChange={(checked) => onToggleActive(link.id, checked)}
        />
        <Button variant="ghost" size="sm" onClick={() => onEdit(link)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" loading={deleting} onClick={handleDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
