import Questionnaire from "@/components/questions";
import { Question } from "@/components/questions";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { RedirectType, redirect } from "next/navigation";


type IdType = {
  id: string;
  [key: string]: any;
};

export default async function Page({ params }: { params: { phase_name: string } }) {
  const phaseName = params.phase_name
  const supabase = createClientComponentClient()
  console.log("Phasename: " && phaseName)
  async function fetch_phase_table(){
    const {data: phaseData, error: phaseError} = await supabase
      .from('phase_table')
      .select('*')
      .eq('phasename', phaseName)
      .single();
    // Redirection if error
    if (phaseError){
      console.log(phaseError)
      console.log("Error -> Redirect")
      redirect("/", RedirectType.replace)
    }
    // Redirection if no phaseName
    if (!phaseData){
      console.log("No data -> Redirect")
      redirect("/", RedirectType.replace)
    }
    return phaseData
  }

  const phaseData = await fetch_phase_table()
  const phaseId = phaseData.phaseid
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 2); // UTC+2

  const phaseOrder = phaseData.phaseorder
  const startDate = new Date(phaseData.startdate);
  const endDate = new Date(phaseData.enddate);
  const isEditable = (currentDate >= startDate) && (currentDate <= endDate);

  if (currentDate < startDate) {
    console.log("Phase didn't start yet")
    return redirect("/", RedirectType.replace)
  }

  async function fetch_question_type_table(questiontype: string, table_name: string, questions: Question[]){
    const { data: questionTypeData, error: questionTypeError } = await supabase
    .from(table_name)
    .select('*')
    .in('id', questions.filter(q => q.questionType === questiontype).map(q => q.id)).single();

    if (questionTypeError) {
      console.error(questionTypeError);
      return null;
    }
    if (questionTypeData) {
      return questionTypeData;
    }
    return {};
  }

  function append_params(question_type_questions: any, question: Question){
    const question_type_params = question_type_questions!.find((params: IdType) => params.id === question.id) || {};
    const { id, ...rest } = question_type_params;
    return {
      ...question,
      params: rest,
    };
  }

  async function fetch_question_table(){
    const { data: questionData, error: errorData } = await supabase
      .from('question_table')
      .select('*')
      .eq('phaseid', phaseId);
    //TODO
    if (errorData){
      console.log("Error:" && errorData)
      return null
    }
    //TODO
    if (!questionData){
      console.log("No Data")
      return null
    }

    // TODO also fetch all other question types
    const long_text_questions = await fetch_question_type_table("longText", "long_text_question_table", questionData)
    const short_text_questions = await fetch_question_type_table("shortText", "short_text_question_table", questionData)

    console.log("Print Questions:" && questionData)
    const combinedQuestions = questionData.map(question => {
      if (question.questionType === 'longText') {
        return append_params(long_text_questions, question)
      }
      if (question.questionType === 'shortText') {
        return append_params(short_text_questions, question)
      }
      
      return question;
    });
  
    return combinedQuestions;
  }

  console.log("Test")
  await fetch_question_table()

  const questionsData = [
    {
      id: '1',
      questionType: QuestionType.ShortText,
      questionOrder: 1,
      phaseID: "phase-1",
      mandatory: true,
      questionText: 'What is your name?',
      params: {}
    },
    {
      id: '2',
      questionType: QuestionType.LongText,
      questionOrder: 2,
      phaseID: "phase-1",
      mandatory: true,
      questionText: 'What is your name?',
      params: {}
    },
    {
      id: '2',
      questionType: QuestionType.NumberPicker,
      questionOrder: 3,
      phaseID: "phase-1",
      mandatory: false,
      questionText: 'How old are you?',
      params: { min: 0, max: 120 }
    },
    {
      id: '3',
      questionType: QuestionType.DatePicker,
      questionOrder: 4,
      phaseID: "phase-1",
      mandatory: false,
      questionText: 'How old are you?',
      params: {}
    },
    {
      id: '4',
      questionType: QuestionType.ImageUpload,
      questionOrder: 5,
      phaseID: "phase-1",
      mandatory: true,
      questionText: 'Please upload your profile picture.',
      params: {}
    },
    {
      id: '5',
      questionType: QuestionType.DateTimePicker,
      questionOrder: 6,
      phaseID: "phase-1",
      mandatory: true,
      questionText: 'Please upload your profile picture.',
      params: {}
    },
    {
      id: '6',
      questionType: QuestionType.VideoUpload,
      questionOrder: 7,
      phaseID: "phase-1",
      mandatory: true,
      questionText: 'Please upload your profile picture.',
      params: {}
    },
    {
      id: '7',
      questionType: QuestionType.Dropdown,
      questionOrder: 10,
      phaseID: "phase-1",
      mandatory: false,
      questionText: 'Please select your favourite animal.',
      params: {options: [
        { optionId: "4", optionText: "Bird" },
        { optionId: "5", optionText: "Lion" },
        { optionId: "6", optionText: "Frog" }
      ]}
    },
    {
      id: '8',
      questionType: QuestionType.PDFUpload,
      questionOrder: 8,
      phaseID: "phase-1",
      mandatory: true,
      questionText: 'Please upload your profile picture.',
      params: {maxSizeInMB: 2}
    },
    {
      id: '9',
      questionType: QuestionType.MultipleChoice,
      questionOrder: 9,
      phaseID: "phase-1",
      mandatory: false,
      questionText: 'Please select your favourite color.',
      params: {choices: [
        { choiceId: "1", choiceText: "Red" },
        { choiceId: "2", choiceText: "Blue" },
        { choiceId: "3", choiceText: "Green" }
      ]}
    },
  ];

  // <form>
  //<Questionnaire questions={questionsData} />
  //</form>

  return (
    <div>My Phase: { phaseName }
      { !isEditable && <div>Derzeit nicht bearbeitbar!</div> }
      <div>
        Test
      </div>
    </div>
  )
}