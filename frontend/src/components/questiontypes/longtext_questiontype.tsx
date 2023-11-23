import React from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";

export interface LongTextQuestionTypeProps extends DefaultQuestionTypeProps {}

const LongTextQuestionType: React.FC<LongTextQuestionTypeProps> = ({
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
      <textarea
        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out resize-none"
        required={mandatory}
        maxLength={200}
        rows={4}
        style={{ minHeight: "100px" }}
      />
    </QuestionTypes>
  );
};

export default LongTextQuestionType;
