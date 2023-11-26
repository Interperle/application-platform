import React from "react";
import QuestionTypes, { DefaultQuestionTypeProps } from "./questiontypes";
import { Choice, ChoiceProps } from "./utils/multiplechoice_choice";

export interface MultipleChoiceQuestionTypeProps
  extends DefaultQuestionTypeProps {
  choices: ChoiceProps[];
}

const MultipleChoiceQuestionType: React.FC<MultipleChoiceQuestionTypeProps> = ({
  phasename,
  questionid,
  mandatory,
  questiontext,
  questionnote,
  choices,
}) => {
  return (
    <QuestionTypes
      phasename={phasename}
      questionid={questionid}
      mandatory={mandatory}
      questiontext={questiontext}
      questionnote={questionnote}
    >
      <div role="group" aria-labelledby={questionid} className="mt-2">
        {choices.map((choice) => (
          <Choice
            key={choice.choiceid}
            choiceid={choice.choiceid}
            choicetext={choice.choicetext}
          />
        ))}
      </div>
    </QuestionTypes>
  );
};

export default MultipleChoiceQuestionType;
