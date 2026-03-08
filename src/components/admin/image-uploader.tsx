"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onFileSelect: (file: File | null) => void;
  label?: string;
}

export function ImageUploader({ currentImageUrl, onFileSelect, label = "Upload Image" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {preview ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            {isDragActive ? "Drop the image here" : "Drag & drop or click to upload"}
          </p>
          <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP up to 10MB</p>
        </div>
      )}
    </div>
  );
}
