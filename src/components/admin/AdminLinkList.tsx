"use client";

import { useRef, useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Check, X, ImagePlus } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { type SiteLink } from "@/lib/siteData";
import { type Platform } from "@/config/profile";

const PLATFORMS: Platform[] = [
  "instagram", "youtube", "tiktok", "twitter",
  "facebook", "linkedin", "github", "custom",
];

/* 썸네일 업로드 컴포넌트 */
function ThumbnailUpload({
  current,
  onUploaded,
}: {
  current?: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
    setLoading(false);
    if (res.ok) {
      const { url } = await res.json();
      onUploaded(url);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {current && (
        <img src={current} alt="thumbnail" className="h-10 w-16 rounded-lg object-cover ring-1 ring-gray-200" />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50"
      >
        {loading ? "업로드 중..." : (
          <><ImagePlus className="h-3.5 w-3.5" /> {current ? "변경" : "썸네일 추가"}</>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
    </div>
  );
}

/* 링크 개별 행 컴포넌트 */
function LinkRow({
  link,
  onDelete,
  onSave,
}: {
  link: SiteLink;
  onDelete: (id: string) => void;
  onSave: (id: string, data: Partial<SiteLink>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(link.label);
  const [url, setUrl] = useState(link.url);
  const [platform, setPlatform] = useState<Platform>(link.platform);
  const [thumbnail, setThumbnail] = useState(link.thumbnail ?? "");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };    

  const handleSave = () => {
    onSave(link.id, { label, url, platform, thumbnail: thumbnail || undefined });
    setEditing(false);
  };

  const handleCancel = () => {
    setLabel(link.label); setUrl(link.url);
    setPlatform(link.platform); setThumbnail(link.thumbnail ?? "");
    setEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {editing ? (
        <div className="space-y-3 p-4">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <Input placeholder="이름" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500">썸네일 이미지</p>
            <ThumbnailUpload
              current={thumbnail}
              onUploaded={(u) => setThumbnail(u)}
            />
            {thumbnail && (
              <button
                type="button"
                onClick={() => setThumbnail("")}
                className="mt-1 text-xs text-red-400 hover:text-red-600"
              >
                이미지 제거
              </button>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}><X className="h-4 w-4" /></Button>
            <Button size="sm" onClick={handleSave}><Check className="h-4 w-4" /> 저장</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4">
          <button className="cursor-grab text-gray-400" {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5" />
          </button>
          {link.thumbnail && (
            <img src={link.thumbnail} alt="" className="h-10 w-14 rounded-lg object-cover shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white">{link.label}</p>
            <p className="truncate text-xs text-gray-500">{link.url}</p>
          </div>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400 shrink-0">
            {link.platform}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(link.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
        </div>
      )}
    </div>
  );
}

/* 링크 추가 폼 컴포넌트 */
function AddLinkForm({ onAdd }: { onAdd: (data: Omit<SiteLink, "id">) => void }) {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleAdd = () => {
    if (!label || !url) return;
    onAdd({ platform, label, url, thumbnail: thumbnail || undefined });
    setLabel(""); setUrl(""); setThumbnail(""); setOpen(false);
  };

  if (!open) return (
    <Button className="w-full" variant="secondary" onClick={() => setOpen(true)}>
      + 링크 추가
    </Button>
  );

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 dark:border-indigo-800 dark:bg-indigo-950/20">
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value as Platform)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <Input placeholder="라벨 (예: Instagram)" value={label} onChange={(e) => setLabel(e.target.value)} />     
      <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <div>
        <p className="mb-1.5 text-xs font-medium text-gray-500">썸네일 이미지 (선택)</p>
        <ThumbnailUpload current={thumbnail} onUploaded={setThumbnail} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>취소</Button>
        <Button size="sm" onClick={handleAdd}>추가</Button>
      </div>
    </div>
  );
}

/* 링크 목록 관리 컴포넌트 */
export default function AdminLinkList({ initialLinks }: { initialLinks: SiteLink[] }) {
  const [links, setLinks] = useState(initialLinks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const reordered = arrayMove(links, links.findIndex((l) => l.id === active.id), links.findIndex((l) => l.id === over.id));
    setLinks(reordered);
    await fetch("/api/admin/links/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((l) => l.id) }),
    });
  };

  const handleAdd = async (data: Omit<SiteLink, "id">) => {
    const res = await fetch("/api/admin/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newLink = await res.json();
    setLinks((prev) => [...prev, newLink]);
  };

  const handleSave = async (id: string, data: Partial<SiteLink>) => {
    await fetch(`/api/admin/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLinks((prev) => prev.map((l: SiteLink) => (l.id === id ? { ...l, ...data } : l)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/links/${id}`, { method: "DELETE" });
    setLinks((prev) => prev.filter((l: SiteLink) => l.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SNS 링크</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map((l: SiteLink) => l.id)} strategy={verticalListSortingStrategy}>
            {links.map((link: SiteLink) => (
              <LinkRow key={link.id} link={link} onDelete={handleDelete} onSave={handleSave} />
            ))}
          </SortableContext>
        </DndContext>
        <AddLinkForm onAdd={handleAdd} />
      </div>
    </Card>
  );
}