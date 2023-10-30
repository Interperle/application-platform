import React from 'react';
import getQuestionComponent, { QuestionType } from '@/components/questiontypes/utils/questiontype_selector';


export interface Question {
  questionid: string;
  questionType: QuestionType;
  questionOrder: number;
  phaseID: string;
  mandatory: boolean;
  questionText: string;
  params: any;
}

interface QuestionnaireProps {
  questions: Question[];
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questions }) => {
  return (
    <div>
      {questions
        .sort((a, b) => a.questionOrder - b.questionOrder)
        .map((question) => {
          const QuestionComponent = getQuestionComponent(question.questionType);
          if (!QuestionComponent) {
            console.error(`Unknown question type: ${question.questionType}`);
            return null;
          }
          return (
            <QuestionComponent
              key={question.questionid}
              questionid={question.questionid}
              mandatory={question.mandatory}
              question_text={question.questionText}
              {...question.params}
            />
          );
        })}
    </div>
  );
};

export default Questionnaire;