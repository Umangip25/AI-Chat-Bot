"use client";

import { useRef, useState } from "react";

export type UploadedFile = {
  name: string;
  type: "pdf" | "docx" | "image";
  content: string; // extracted text or base64
  mimeType: string;
};

type Props = {
  onFileReady: (file: UploadedFile) => void;
};

export default function FileUpload({ onFileReady }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    setIsProcessing(true);

    try {
      // IMAGE
      if (file.type.startsWith("image/")) {
        // Check file size — OpenAI has a 20MB limit
        if (file.size > 20 * 1024 * 1024) {
          alert("Image is too large. Please upload an image under 20MB.");
          return;
        }

        const base64 = await toBase64(file);
        onFileReady({
          name: file.name,
          type: "image",
          content: base64,
          mimeType: file.type,
        });
        return;
      }

      // PDF
      if (file.type === "application/pdf") {
        const text = await extractPdfText(file);
        onFileReady({
          name: file.name,
          type: "pdf",
          content: text,
          mimeType: file.type,
        });
        return;
      }

      // DOCX
      if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword" ||
        file.name.endsWith(".docx") ||
        file.name.endsWith(".doc")
      ) {
        const text = await extractDocxText(file);
        onFileReady({
          name: file.name,
          type: "docx",
          content: text,
          mimeType: file.type,
        });
        return;
      }

      alert("Unsupported file type. Please upload a PDF, Word doc, or image.");
    } catch (err) {
      console.error("File processing error:", err);
      alert("Failed to process file. Please try again.");
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isProcessing}
        title="Attach file"
        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-opacity disabled:opacity-40"
        style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        {isProcessing ? "⏳" : "📎"}
      </button>
    </>
  );
}

// ————— Helpers —————

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (!result.includes(",")) {
        reject(new Error("Invalid base64 result"));
        return;
      }
      resolve(result.split(",")[1]);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}


async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  
  // Fix: use legacy build worker which is more compatible
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}