"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import LinkCard from "./LinkCard";
import LinkForm from "./LinkForm";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { LinkItem } from "@/types";

interface LinkListProps {
  initialLinks: LinkItem[];
}

export default function LinkList({ initialLinks }: LinkListProps) {
  const [links, setLinks] = useState(initialLinks);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex).map((l, i) => ({ ...l, order: i }));
    setLinks(reordered);

    await fetch("/api/links/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((l: LinkItem) => l.id) }),
    });
  };

  const handleAdd = async (data: { title: string; url: string; icon?: string }) => {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const link = await res.json();
    setLinks((prev) => [...prev, link]);
    setShowForm(false);
  };

  const handleEdit = async (data: { title: string; url: string; icon?: string }) => {
    if (!editingLink) return;
    const res = await fetch(`/api/links/${editingLink.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setLinks((prev) => prev.map((l: LinkItem) => (l.id === updated.id ? updated : l)));
    setEditingLink(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    setLinks((prev) => prev.filter((l: LinkItem) => l.id !== id));
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    setLinks((prev) => prev.map((l: LinkItem) => (l.id === id ? { ...l, active } : l)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links</CardTitle>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Add link
        </Button>
      </CardHeader>

      {(showForm || editingLink) && (
        <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
          <LinkForm
            initial={editingLink ?? undefined}
            onSave={editingLink ? handleEdit : handleAdd}
            onCancel={() => { setShowForm(false); setEditingLink(null); }}
          />
        </div>
      )}

      {links.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No links yet. Add your first link!
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map((l: LinkItem) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {links.map((link: LinkItem) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onEdit={setEditingLink}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </Card>
  );
}