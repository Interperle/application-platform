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

export interface VideoUploadQuestionTypeProps
  extends DefaultQuestionTypeProps {
    answerid: string | null;
  }

const VideoUploadQuestionType: React.FC<VideoUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  answerid,
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
        if (answerid){
          const VideoUploadBucketData = await fetchVideoUploadAnswer(questionid);
          const url = URL.createObjectURL(VideoUploadBucketData!);
          setUploadVideo(url);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch answer", error);
      }
    }
    loadAnswer();
  }, [questionid]);

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadVideo(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeleteOnClick = () => {
    if(answerid){
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
    >
      <form action={saveVideoUploadAnswerWithId}>
        <AwaitingChild isLoading={isLoading}>
          <input
            type="file"
            name={questionid}
            id={questionid}
            accept="video/mp4"
            required={mandatory}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            onChange={(event) => handleUploadChange(event)}
          />
        </AwaitingChild>
        {uploadUrl && (
          <div className="mt-4">
            <video width="320" height="240" controls>
              <source src={uploadUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button onClick={handleDeleteOnClick}>Delete</button>
          </div>
        )}
        <SubmitButton text={"Video hochladen"} expanded={false} />
      </form>
    </QuestionTypes>
  );
};

export default VideoUploadQuestionType;
