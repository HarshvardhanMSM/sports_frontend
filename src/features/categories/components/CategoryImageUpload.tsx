"use client";

import { useState, useRef } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { getImageUrl } from "@/lib/utils";

interface CategoryImageUploadProps {
  currentImage?: string;
  onFileSelect: (file: File | null) => void;
}

export default function CategoryImageUpload({ currentImage, onFileSelect }: CategoryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const displayUrl = preview ?? currentImage;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        Category Image
      </label>
      <div className="flex items-start gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {displayUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getImageUrl(displayUrl)} alt="Preview" className="size-full object-cover" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-white/80 text-slate-500 hover:bg-white hover:text-red-600 shadow-sm"
              >
                <FiX className="size-3" />
              </button>
            </>
          ) : (
            <div className="flex size-full items-center justify-center text-slate-300">
              <FiUpload className="size-8" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {currentImage ? "Replace Image" : "Upload Image"}
          </button>
          <p className="text-xs text-slate-400 mt-1.5">JPG, PNG or WebP. Max 2MB.</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
