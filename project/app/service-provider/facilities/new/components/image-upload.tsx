"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({
  value,
  onChange,
  onRemove
}: ImageUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        
        const data = await response.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      onChange([...value, ...urls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-gray-400 transition"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-500">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here, or click to select files"}
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {value.map((url) => (
            <div key={url} className="relative group">
              <Image
                src={url}
                alt="Uploaded image"
                className="rounded-lg object-cover"
                width={200}
                height={200}
              />
              <button
                onClick={() => onRemove(url)}
                className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 