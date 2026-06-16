"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/atoms";

type ImageUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxFiles?: number;
  label?: string;
};

type UploadingFile = {
  id: string;
  name: string;
  progress: number;
};

export function ImageUploader({
  value = [],
  onChange,
  folder = "general",
  maxFiles = 10,
  label = "Upload Images",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const uploadFile = (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    const newUploadingFile: UploadingFile = {
      id: fileId,
      name: file.name,
      progress: 0,
    };

    setUploadingFiles((prev) => [...prev, newUploadingFile]);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    xhr.open("POST", "/api/cloudinary/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: percentComplete } : f))
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.secure_url) {
            onChange([...value, response.secure_url]);
          }
        } catch (e) {
          console.error("Error parsing upload response:", e);
        }
      } else {
        console.error("Upload failed with status:", xhr.status);
      }
      setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    xhr.onerror = () => {
      console.error("XHR network error during upload");
      setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    xhr.send(formData);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remainingSlots = maxFiles - value.length - uploadingFiles.length;
    const filesArray = Array.from(files).slice(0, Math.max(0, remainingSlots));

    filesArray.forEach((file) => {
      if (file.type.startsWith("image/")) {
        uploadFile(file);
      }
    });
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  const isLimitReached = value.length + uploadingFiles.length >= maxFiles;

  return (
    <div className="space-y-4">
      {/* Thumbnails grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url, idx) => (
            <div
              key={url}
              className="group relative aspect-video overflow-hidden rounded-xl border border-white/60 bg-muted shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${label} preview ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-destructive"
                aria-label={`Remove image ${idx + 1}`}
              >
                <X className="size-4" />
              </button>
              <div className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
                {idx === 0 ? "Cover" : `Gallery ${idx}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {!isLimitReached && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 bg-white/40 hover:bg-white/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple={maxFiles > 1}
            accept="image/*"
            className="hidden"
          />
          <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
            <Upload className="size-6 animate-pulse" />
          </div>
          <p className="text-sm font-medium">
            Drag & drop images here, or <span className="text-primary hover:underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports JPEG, PNG, WebP (Max {maxFiles} images)
          </p>
        </div>
      )}

      {/* Progress list */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/80 p-3 text-sm shadow-sm"
            >
              <Loader2 className="size-4 animate-spin text-primary" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="text-muted-foreground">{file.progress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
