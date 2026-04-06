"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { LinkItem } from "@/types";

interface LinkFormProps {
  initial?: Partial<LinkItem>;
  onSave: (data: { title: string; url: string; icon?: string }) => Promise<void>;
  onCancel: () => void;
}

export default function LinkForm({ initial, onSave, onCancel }: LinkFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  const validate = () => {
    const errs: { title?: string; url?: string } = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!url.trim()) errs.url = "URL is required";
    else {
      try { new URL(url); } catch { errs.url = "Enter a valid URL"; }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({ title: title.trim(), url: url.trim(), icon: icon.trim() || undefined });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        placeholder="My Website"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />
      <Input
        label="URL"
        placeholder="https://example.com"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={errors.url}
      />
      <Input
        label="Icon (emoji, optional)"
        placeholder="🔗"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial?.id ? "Save changes" : "Add link"}
        </Button>
      </div>
    </form>
  );
}
