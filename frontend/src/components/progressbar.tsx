"use client";
import { supabase } from "@/utils/supabaseBrowserClient";
import React, { useEffect, useState } from "react";
import { AwaitingChild } from "./awaiting";
import { transformReadableDate } from "@/utils/helpers";

export const ProgressBar = ({
  mandatoryQuestionIds,
  numAnswers,
  endDate,
}: {
  mandatoryQuestionIds: string[];
  numAnswers: number;
  endDate: string;
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
  const stringDate = transformReadableDate(endDate);
  return (
    <AwaitingChild isLoading={isLoading}>
      <div className="w-full bg-gray-300 rounded-2xl border">
        <div
          style={{
            width: `${(numAnswered / mandatoryQuestionIds.length) * 100}%`,
          }}
          className={`h-4 rounded-2xl border ${
            numAnswered != mandatoryQuestionIds.length
              ? "bg-secondary"
              : "bg-green-600"
          }`}
        />
      </div>
      {numAnswered == mandatoryQuestionIds.length &&
        (new Date(endDate) > new Date(Date.now()) ? (
          <div className="md-3 italic text-gray-500">
            Deine Bewerbungsphase ist vollständig, du kannst sie aber bis zum{" "}
            {stringDate} weiter ändern.
          </div>
        ) : (
          <div className="md-3 italic text-gray-500">
            Deine Bewerbungsphase ist vollständig. Die Phase ist seit dem{" "}
            {stringDate} zu Ende. Du kannst deine Ergebnisse weiterhin einsehen.
          </div>
        ))}
    </AwaitingChild>
  );
};
