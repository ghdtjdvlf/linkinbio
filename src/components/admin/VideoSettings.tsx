"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Upload, X } from "lucide-react";

interface VideoSettingsProps {
  initial: string;
}

export default function VideoSettings({ initial }: VideoSettingsProps) {
  const [current, setCurrent] = useState(initial);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "업로드 실패");
      setPreview(null);
      return;
    }

    const { url } = await res.json();
    setCurrent(url);
    setPreview(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>배경 영상</CardTitle>
        {current && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
            업로드됨
          </span>
        )}
      </CardHeader>

      {/* 현재 영상 미리보기 */}
      {current && !preview && (
        <div className="relative mb-4 overflow-hidden rounded-xl bg-black">
          <video
            src={current}
            muted
            loop
            autoPlay
            playsInline
            className="h-40 w-full object-cover opacity-80"
          />
          <button
            onClick={() => {
              setCurrent("");
              fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ backgroundVideo: "" }),
              });
            }}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 업로드 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 transition-colors hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-indigo-500"
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-500">업로드 중...</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                클릭하거나 드래그해서 업로드
              </p>
              <p className="mt-1 text-xs text-gray-400">MP4, WebM, MOV</p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </Card>
  );
}
