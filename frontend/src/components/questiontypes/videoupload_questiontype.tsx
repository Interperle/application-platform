import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';

export interface VideoUploadQuestionTypeProps extends DefaultQuestionTypeProps {}

const VideoUploadQuestionType: React.FC<VideoUploadQuestionTypeProps> = ({ id, mandatory, question_text }) => {
    const uploading = false;
    const videoUrl = ""
    return (
        <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
            <input
                type="file"
                name={id}
                id={id}
                accept="video/mp4,video/x-m4v,video/*"
                required={mandatory}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {uploading && <p>Uploading...</p>}
            {videoUrl && (
                <div className="mt-4">
                <p>Video uploaded successfully!</p>
                <video controls width="100%" height="auto">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                </div>
            )}
        </QuestionTypes>
    );
};

export default VideoUploadQuestionType;