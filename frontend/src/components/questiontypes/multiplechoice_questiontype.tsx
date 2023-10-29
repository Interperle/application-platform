import React from 'react';
import QuestionTypes, { DefaultQuestionTypeProps } from './questiontypes';
import { Choice, ChoiceProps } from './utils/multiplechoice_choice'

export interface MultipleChoiceQuestionTypeProps extends DefaultQuestionTypeProps {
    choices: ChoiceProps[];
}

const MultipleChoiceQuestionType: React.FC<MultipleChoiceQuestionTypeProps> = ({ id, mandatory, question_text, choices }) => {

  return (
    <QuestionTypes id={id} mandatory={mandatory} question_text={question_text}>
      <div role="group" aria-labelledby={id} className="mt-2">
        {choices.map(choice => (
          <Choice key={choice.choiceId} choiceId={choice.choiceId} choiceText={choice.choiceText} />
        ))}
      </div>
    </QuestionTypes>
  );
};

export default MultipleChoiceQuestionType;
