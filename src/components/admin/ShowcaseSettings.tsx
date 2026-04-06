"use client";

import { useState, useRef } from "react";
import { Pencil, Trash2, Check, X, ImagePlus, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { type ShowcaseItem } from "@/lib/siteData";

/* ── 이미지 업로드 버튼 ── */
function ImageUpload({ current, onUploaded }: { current?: string; onUploaded: (url: string) => void }) {
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
        <img src={current} alt="" className="h-10 w-16 rounded-lg object-cover ring-1 ring-gray-200" />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50"
      >
        <ImagePlus className="h-3.5 w-3.5" />
        {loading ? "업로드 중..." : current ? "변경" : "이미지"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
    </div>
  );
}

/* ── 개별 아이템 행 ── */
function ShowcaseRow({ item, onDelete, onSave }: {
  item: ShowcaseItem;
  onDelete: (id: string) => void;
  onSave: (id: string, data: Partial<ShowcaseItem>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [heading, setHeading] = useState(item.heading);
  const [description, setDescription] = useState(item.description);
  const [media, setMedia] = useState(item.media);
  const [link, setLink] = useState(item.link ?? "");

  const handleSave = () => {
    onSave(item.id, { heading, description, media, link });
    setEditing(false);
  };

  const handleCancel = () => {
    setHeading(item.heading); setDescription(item.description);
    setMedia(item.media); setLink(item.link ?? "");
    setEditing(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {editing ? (
        <div className="space-y-3 p-4">
          <Input placeholder="제목" value={heading} onChange={(e) => setHeading(e.target.value)} />
          <Input placeholder="설명" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="링크 URL (선택)" value={link} onChange={(e) => setLink(e.target.value)} />
          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-500">이미지</p>
            <ImageUpload current={media} onUploaded={setMedia} />
            {!media && (
              <Input
                placeholder="또는 이미지 URL 직접 입력"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}><X className="h-4 w-4" /></Button>
            <Button size="sm" onClick={handleSave}><Check className="h-4 w-4" /> 저장</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4">
          {item.media && (
            <img src={item.media} alt="" className="h-12 w-16 rounded-lg object-cover shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white">{item.heading}</p>
            <p className="truncate text-xs text-gray-500">{item.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
        </div>
      )}
    </div>
  );
}

/* ── 추가 폼 ── */
function AddShowcaseForm({ onAdd }: { onAdd: (data: Omit<ShowcaseItem, "id">) => void }) {
  const [open, setOpen] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState("");
  const [link, setLink] = useState("");

  const handleAdd = () => {
    if (!heading) return;
    onAdd({ heading, description, media, link });
    setHeading(""); setDescription(""); setMedia(""); setLink(""); setOpen(false);
  };

  if (!open) return (
    <Button className="w-full" variant="secondary" onClick={() => setOpen(true)}>
      <Plus className="h-4 w-4" /> 항목 추가
    </Button>
  );

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 dark:border-indigo-800 dark:bg-indigo-950/20">
      <Input placeholder="제목" value={heading} onChange={(e) => setHeading(e.target.value)} />
      <Input placeholder="설명" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder="링크 URL (선택)" value={link} onChange={(e) => setLink(e.target.value)} />
      <div>
        <p className="mb-1.5 text-xs font-medium text-gray-500">이미지</p>
        <ImageUpload current={media} onUploaded={setMedia} />
        <Input placeholder="또는 이미지 URL 직접 입력" value={media} onChange={(e) => setMedia(e.target.value)} className="mt-2" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>취소</Button>
        <Button size="sm" onClick={handleAdd}>추가</Button>
      </div>
    </div>
  );
}

/* ── 메인 ── */
export default function ShowcaseSettings({ initialItems }: { initialItems: ShowcaseItem[] }) {
  const [items, setItems] = useState(initialItems);

  const handleAdd = async (data: Omit<ShowcaseItem, "id">) => {
    const res = await fetch("/api/admin/showcase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newItem = await res.json();
    setItems((prev) => [...prev, newItem]);
  };

  const handleSave = async (id: string, data: Partial<ShowcaseItem>) => {
    await fetch(`/api/admin/showcase/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/showcase/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Showcase</CardTitle>
        <span className="text-xs text-gray-400">자동 순환 · 클릭 전환</span>
      </CardHeader>
      <div className="space-y-3">
        {items.map((item) => (
          <ShowcaseRow key={item.id} item={item} onDelete={handleDelete} onSave={handleSave} />
        ))}
        <AddShowcaseForm onAdd={handleAdd} />
      </div>
    </Card>
  );
}
