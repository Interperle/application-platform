"use client"
import { downloadFile } from "@/utils/helpers";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Page() {
  const [easteregg, setEasteregg] = useState("");

  useEffect(() => {
    async function loadAnswer() {
      const imageUploadBucketData = await downloadFile(
        "eastereggs",
        "marib.jpg",
      );
      const url = URL.createObjectURL(imageUploadBucketData!);
      setEasteregg(url || "");
    }
    loadAnswer();
  });

  return (
    <div>
      <div>REVIEW DASHBOARD</div>
      <Image
        alt="Preview"
        src={easteregg}
        className="self-center max-w-xs max-h-96"
        id="imagePreview"
        width={100}
        height={100}
      />
      <div>Under Construction</div>
    </div>
  );
}
