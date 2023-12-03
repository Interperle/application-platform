"use client";
import { supabase } from "@/utils/supabaseBrowserClient";
import React, { useEffect, useState } from "react";
import Awaiting, { AwaitingChild } from "./awaiting";

export const ProgressBar = ({
  mandatoryQuestionIds,
  numAnswers,
}: {
  mandatoryQuestionIds: string[];
  numAnswers: number;
}) => {
  const [numAnswered, setNumAnswered] = useState(numAnswers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const progressbarChannel = supabase
      .channel("progressbar-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "answer_table",
          filter: `questionid=in.(${mandatoryQuestionIds.join(" ,")})`,
        },
        () => {
          setNumAnswered((currentNumAnswered) => currentNumAnswered + 1);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "answer_table",
          filter: `questionid=in.(${mandatoryQuestionIds.join(" ,")})`,
        },
        () => {
          setNumAnswered((currentNumAnswered) => currentNumAnswered - 1);
        },
      )
      .subscribe();
    setIsLoading(false);
    return () => {
      supabase.removeChannel(progressbarChannel);
    };
  }, [mandatoryQuestionIds]);
  return (
    <AwaitingChild isLoading={isLoading}>
      <div className="w-full bg-gray-300 rounded-2xl border">
        <div
          style={{
            width: `${(numAnswered / mandatoryQuestionIds.length) * 100}%`,
          }}
          className="bg-blue-600 h-4 rounded-2xl border"
        />
      </div>
    </AwaitingChild>
  );
};
