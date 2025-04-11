import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export function MediaDocumentsForm({ setImages }) {
  const [previewImages, setPreviewImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      return;
    }

    // Update parent state
    setImages((prev) => [...prev, ...imageFiles]);

    // Create preview URLs for display
    const newPreviews = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index].preview);

    // Remove from previews
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    // Update parent state
    setImages((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media & Documents</CardTitle>
        <CardDescription>
          Upload photos and documents related to the property.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-200"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">
              Drag & drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports JPEG, PNG, GIF (max 10MB each)
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                asChild
              >
                <span>Browse Files</span>
              </Button>
            </label>
          </div>
        </div>

        {previewImages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Uploaded Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden border"
                >
                  <Image
                    src={image.preview}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {previewImages.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 border rounded-md">
            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">
              No images uploaded yet. Add some to enhance your property listing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
