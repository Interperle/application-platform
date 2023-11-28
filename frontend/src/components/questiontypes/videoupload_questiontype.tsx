"use client";

import React, { useEffect, useState } from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import {
  deleteVideoUploadAnswer,
  saveVideoUploadAnswer,
} from "@/actions/answers/videoUpload";
import { fetchVideoUploadAnswer } from "@/utils/helpers";

export interface VideoUploadQuestionTypeProps
  extends DefaultQuestionTypeProps {}

const VideoUploadQuestionType: React.FC<VideoUploadQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
}) => {
  const saveVideoUploadAnswerWithId = saveVideoUploadAnswer.bind(
    null,
    questionid,
  );
  const [uploadUrl, setUploadVideo] = useState("");

  useEffect(() => {
    async function loadAnswer() {
      try {
        const VideoUploadBucketData = await fetchVideoUploadAnswer(questionid);
        const url = URL.createObjectURL(VideoUploadBucketData!);
        setUploadVideo(url);
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
    deleteVideoUploadAnswer(questionid);
    setUploadVideo("");
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
        <input
          type="file"
          name={questionid}
          id={questionid}
          accept="video/mp4"
          required={mandatory}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onChange={(event) => handleUploadChange(event)}
        />
        {uploadUrl && (
          <div className="mt-4">
            <video width="320" height="240" controls>
              <source src={uploadUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button onClick={handleDeleteOnClick}>Delete</button>
          </div>
        )}
        <button type="submit">Video speichern</button>
      </form>
    </QuestionTypes>
  );
};

export default VideoUploadQuestionType;
