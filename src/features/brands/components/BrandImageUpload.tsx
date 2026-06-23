"use client";

import { useRef, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { getImageUrl } from "@/lib/utils";

interface BrandImageUploadProps {
  currentLogo?: string;
  onFileChange: (file: File | null) => void;
}

export default function BrandImageUpload({ currentLogo, onFileChange }: BrandImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const src = preview ?? currentLogo;

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        Brand Logo
      </label>
      <div className="flex items-center gap-4">
        {src && (
          <div className="relative size-20 shrink-0 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
            >
              <FiX className="size-3" />
            </button>
            <img src={getImageUrl(src)} alt="Brand logo preview" className="size-full object-contain" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FiUpload className="size-4" />
          {src ? "Change Logo" : "Upload Logo"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />
      </div>
    </div>
  );
}
