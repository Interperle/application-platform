"use client";

import React from "react";

import { useRouter } from "next/navigation";

const OverviewButton: React.FC = () => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/`);
  };

  return <button onClick={handleRedirect}>{"<- Zur Übersicht"}</button>;
};

export default OverviewButton;
