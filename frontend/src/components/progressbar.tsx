"use client";
import { supabase } from "@/utils/supabase_client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ProgressBar = ({
  mandatoryQuestionIds,
  numAnswers,
}: {
  mandatoryQuestionIds: string[];
  numAnswers: number;
}) => {
  const [numAnswered, setNumAnswered] = useState(numAnswers);
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
    return () => {
      supabase.removeChannel(progressbarChannel);
    };
  }, [supabase]);
  return (
    <div className="w-full bg-gray-300 rounded-2xl border">
      <div
        style={{
          width: `${(numAnswered / mandatoryQuestionIds.length) * 100}%`,
        }}
        className="bg-blue-600 h-4 rounded-2xl border"
      />
    </div>
  );
};
