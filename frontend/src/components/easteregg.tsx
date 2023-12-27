"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { downloadFile } from "@/utils/helpers";

export default function Easteregg({ person }: { person: string }) {
  const [easteregg, setEasteregg] = useState("");

  useEffect(() => {
    async function loadAnswer() {
      const imageUploadBucketData = await downloadFile(
        "eastereggs",
        `${person}.jpg`,
      );
      const url = URL.createObjectURL(imageUploadBucketData!);
      setEasteregg(url || "");
    }
    loadAnswer();
  }, [person]);

  return (
    <Image
      alt={`easteregg${person}`}
      src={easteregg}
      id={`easteregg${person}`}
      width="500"
      height="400"
    />
  );
}
