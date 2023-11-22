import React from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";

export interface ShortTextQuestionTypeProps extends DefaultQuestionTypeProps {}

const ShortTextQuestionType: React.FC<ShortTextQuestionTypeProps> = ({
  questionid,
  mandatory,
  question_text,
  questionnote,
}) => {
  return (
    <QuestionTypes
      questionid={questionid}
      mandatory={mandatory}
      question_text={question_text}
      questionnote={questionnote}
    >
      <input
        type="text"
        name={questionid}
        id={questionid}
        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
        required={mandatory}
        maxLength={50}
      />
    </QuestionTypes>
  );
};

export default ShortTextQuestionType;
