"use client";

import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  deleteVideoUploadAnswer,
  saveVideoUploadAnswer,
} from "@/actions/answers/videoUpload";
import { fetchVideoUploadAnswer } from "@/utils/helpers";
import { SubmitButton } from "../submitButton";
import { AwaitingChild } from "../awaiting";

export interface VideoUploadQuestionTypeProps extends DefaultQuestionTypeProps {
  answerid: string | null;
  maxfilesizeinmb: number;
}

const VideoUploadQuestionType: React.FC<VideoUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  questionorder,
  answerid,
  maxfilesizeinmb,
}) => {
  const saveVideoUploadAnswerWithId = saveVideoUploadAnswer.bind(
    null,
    questionid,
  );
  const [uploadUrl, setUploadVideo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnswer() {
      try {
        if (answerid) {
          const VideoUploadBucketData =
            await fetchVideoUploadAnswer(questionid);
          const url = URL.createObjectURL(VideoUploadBucketData!);
          setUploadVideo(url);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid, answerid]);

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileSizeInMB = file.size / 1024 / 1024;
      if (fileSizeInMB > maxfilesizeinmb) {
        alert(`Die Bilddatei darf maximal ${maxfilesizeinmb} MB groß sein!`);
        return;
      }
      setUploadVideo(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeleteOnClick = () => {
    if (answerid) {
      deleteVideoUploadAnswer(questionid, answerid);
      setUploadVideo("");
    }
  };

  return (
    <QuestionTypes
      phasename={phasename}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
      questionorder={questionorder}
    >
      <form action={saveVideoUploadAnswerWithId}>
        <AwaitingChild isLoading={isLoading}>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor={questionid}
              className="flex flex-col items-center justify-center w-full h-34 border-2 border-secondary border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-secondary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-secondary text-center">
                  <p className="font-semibold">Zum Uploaden klicken</p> oder per
                  Drag and Drop
                </p>
                <p className="text-xs text-secondary">MP4 (MAX. 2MB)</p>
              </div>
              <input
                type="file"
                name={questionid}
                id={questionid}
                accept="video/mp4"
                required={mandatory}
                className="hidden"
                onChange={(event) => handleUploadChange(event)}
              />
            </label>
          </div>
        </AwaitingChild>
        {uploadUrl && (
          <div className="mt-4 flex flex-col gap-y-2">
            <button
              className="self-end text-red-600"
              onClick={handleDeleteOnClick}
            >
              Löschen
            </button>
            <video
              width="100%"
              height="600px max-w-xs self-center"
              style={{ border: "none" }}
              controls
            >
              <source src={uploadUrl} type="video/mp4" />
              Dein Browser supported diese Darstellung leider nicht
            </video>
            <SubmitButton text={"Video hochladen"} expanded={false} />
          </div>
        )}
      </form>
    </QuestionTypes>
  );
};

export default VideoUploadQuestionType;
