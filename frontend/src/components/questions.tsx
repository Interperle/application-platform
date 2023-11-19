import React from 'react';
import getQuestionComponent, { QuestionType } from '@/components/questiontypes/utils/questiontype_selector';


export interface DefaultQuestion {
  questionid: string;
  questiontype: QuestionType;
  questionorder: number;
  phaseid: string;
  mandatory: boolean;
  questiontext: string;
  questionnote: string;
}

export interface Question extends DefaultQuestion {
  params: any;
}

interface QuestionnaireProps {
  questions: Question[];
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questions }) => {
  return (
    <div>
      {questions
        .sort((a, b) => a.questionorder - b.questionorder)
        .map((question) => {
          const QuestionComponent = getQuestionComponent(question.questiontype);
          if (!QuestionComponent) {
            console.error(`Unknown question type: ${question.questiontype}`);
            return null;
          }
          return (
            <QuestionComponent
              key={question.questionid}
              questionid={question.questionid}
              mandatory={question.mandatory}
              question_text={question.questiontext}
              questionnote={question.questionnote}
              {...question.params}
            />
          );
        })}
    </div>
  );
};

export default Questionnaire;