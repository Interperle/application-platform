import Questionnaire, { DefaultQuestion } from "@/components/questions";
import { Question } from "@/components/questions";
import { QuestionType, QuestionTypeTable } from "@/components/questiontypes/utils/questiontype_selector";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { RedirectType, redirect } from "next/navigation";


type IdType = {
  questionid: string;
  [key: string]: any;
};

export default async function Page({ params }: { params: { phase_name: string } }) {
  const phaseName = params.phase_name
  const supabase = createClientComponentClient({supabaseUrl: "https://uppfhawtpuoynrrijion.supabase.co", supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcGZoYXd0cHVveW5ycmlqaW9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDk4OTM5MywiZXhwIjoyMDEwNTY1MzkzfQ.tuX_RUFy1C9_SP1x8XTCiRTkahmNSsUtdWP6CBnqzDs"})
  console.log("")
  console.log("Phasename: " + phaseName)
  async function fetch_phase_table(){
    const {data: phaseData, error: phaseError} = await supabase
      .from('phase_table')
      .select('*')
      .eq('phasename', phaseName)
      .single();
    // Redirection if error
    if (phaseError){
      console.log("Error: " + phaseError + " -> Redirect")
      redirect("/", RedirectType.replace)
    }
    // Redirection if no phaseName
    if (!phaseData){
      console.log("No data " + phaseData + " -> Redirect")
      redirect("/", RedirectType.replace)
    }
    return phaseData
  }

  async function fetch_question_type_table(questiontype: string, table_name: string, questions: DefaultQuestion[]){
    console.log("Fetch: '" + questiontype + "'; in table: " + table_name)
    const { data: questionTypeData, error: questionTypeError } = await supabase
      .from(table_name)
      .select('*')
      .in('questionid', questions.filter(q => q.questiontype === questiontype).map(q => q.questionid));

    console.log("QuestionType Data: " + questionTypeData?.length)
    if (questionTypeError) {
      console.log("QuestionType Error: Return Null")
      console.error(questionTypeError);
      return null;
    }
    if (questionTypeData) {
      return questionTypeData;
    }
    return {};
  }

  function append_params(question_type_questions: any, question: DefaultQuestion){
    console.log("APPEND_PARAMS:")
    console.log(question_type_questions)
    console.log(question)
    const question_type_params = question_type_questions!.find((params: IdType) => params.questionid === question.questionid) || {};
    console.log("Questiontext: " + question.questiontext)
    const { questionid, ...rest } = question_type_params;
    console.log("Questiontext: " + question.questiontext)
    return {
      ...question,
      params: rest,
    };
  }

  async function fetch_question_table(): Promise<Question[]>{
    const { data: questionData, error: errorData } = await supabase
      .from('question_table')
      .select('*')
      .eq('phaseid', phaseId);
    //TODO
    if (errorData){
      console.log("Error:" && errorData)
      redirect("/404", RedirectType.replace) 
    }
    //TODO
    if (!questionData){
      console.log("No Data")
      redirect("/404", RedirectType.replace) 
    }
    console.log(questionData)
    // TODO also fetch all other question types
    const long_text_questions = await fetch_question_type_table(QuestionType.LongText, QuestionTypeTable.LongTextQuestionTable, questionData)
    const short_text_questions = await fetch_question_type_table(QuestionType.ShortText, QuestionTypeTable.ShortTextQuestionTable, questionData)

    const combinedQuestions = questionData.map(question => {
      if (question.questiontype === QuestionType.LongText) {
        return append_params(long_text_questions, question)
      }
      if (question.questiontype === QuestionType.ShortText) {
        return append_params(short_text_questions, question)
      }
      return question;
    });
  
    return combinedQuestions;
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

  const phase_questions = await fetch_question_table()
  console.log("Render Questionnaire")

  const questionsData = [
    {
      questionid: '2',
      questiontype: QuestionType.NumberPicker,
      questionorder: 3,
      phaseid: "phase-1",
      mandatory: false,
      questiontext: 'How old are you?',
      params: { min: 0, max: 120 }
    },
    {
      questionid: '3',
      questiontype: QuestionType.DatePicker,
      questionorder: 4,
      phaseid: "phase-1",
      mandatory: false,
      questiontext: 'How old are you?',
      params: {}
    },
    {
      questionid: '4',
      questiontype: QuestionType.ImageUpload,
      questionorder: 5,
      phaseid: "phase-1",
      mandatory: true,
      questiontext: 'Please upload your profile picture.',
      params: {}
    },
    {
      questionid: '5',
      questiontype: QuestionType.DateTimePicker,
      questionorder: 6,
      phaseid: "phase-1",
      mandatory: true,
      questiontext: 'Please upload your profile picture.',
      params: {}
    },
    {
      questionid: '6',
      questiontype: QuestionType.VideoUpload,
      questionorder: 7,
      phaseid: "phase-1",
      mandatory: true,
      questiontext: 'Please upload your profile picture.',
      params: {}
    },
    {
      questionid: '7',
      questiontype: QuestionType.Dropdown,
      questionorder: 10,
      phaseid: "phase-1",
      mandatory: false,
      questiontext: 'Please select your favourite animal.',
      params: {options: [
        { optionId: "4", optionText: "Bird" },
        { optionId: "5", optionText: "Lion" },
        { optionId: "6", optionText: "Frog" }
      ]}
    },
    {
      questionid: '8',
      questiontype: QuestionType.PDFUpload,
      questionorder: 8,
      phaseid: "phase-1",
      mandatory: true,
      questiontext: 'Please upload your profile picture.',
      params: {maxSizeInMB: 2}
    },
    {
      questionid: '9',
      questiontype: QuestionType.MultipleChoice,
      questionorder: 9,
      phaseid: "phase-1",
      mandatory: false,
      questiontext: 'Please select your favourite color.',
      params: {choices: [
        { choiceId: "1", choiceText: "Red" },
        { choiceId: "2", choiceText: "Blue" },
        { choiceId: "3", choiceText: "Green" }
      ]}
    },
  ];



  return (
    <div>My Phase: { phaseName }
      { !isEditable && <div>Derzeit nicht bearbeitbar!</div> }
      <div>
        <form>
          <Questionnaire questions={questionsData} />
        </form>
      </div>
    </div>
  )
}