import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';
import { Choice, ChoiceProps } from './utils/multiplechoice_choice'

export interface MultipleChoiceQuestionTypeProps extends DefaultQuestionTypeProps {
    choices: ChoiceProps[];
}

const MultipleChoiceQuestionType: React.FC<MultipleChoiceQuestionTypeProps> = ({ questionid, mandatory, question_text, choices }) => {

  return (
    <QuestionTypes questionid={questionid} mandatory={mandatory} question_text={question_text}>
      <div role="group" aria-labelledby={questionid} className="mt-2">
        {choices.map(choice => (
          <Choice key={choice.choiceid} choiceid={choice.choiceid} choicetext={choice.choicetext} />
        ))}
      </div>
    </QuestionTypes>
  );
};

export default MultipleChoiceQuestionType;
