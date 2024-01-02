"use client";

import React from "react";

import { useRouter } from "next/navigation";

const OverviewButton: React.FC<{ slug?: string }> = ({ slug }) => {
  const router = useRouter();
  const handleRedirect = () => {
    if (slug !== undefined) {
      router.push(`/${slug}`);
    } else {
      router.push(`/`);
    }
  };
  return <button onClick={handleRedirect}>{`<- Zur Startseite`}</button>;
};

export default OverviewButton;
