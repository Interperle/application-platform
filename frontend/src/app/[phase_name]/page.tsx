import Questionnaire from "@/components/questions";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { RedirectType, redirect } from "next/navigation";
import { NextResponse } from "next/server";


export default async function Page({ params }: { params: { phase_name: string } }) {
  const phase_name = params.phase_name
  const supabase = createClientComponentClient()
  const { data, error } = await supabase
    .from('phase_table')
    .select('*')
    .eq('phasename', phase_name)
    .single();
  // Redirection if error
  if (error){
    return redirect("/", RedirectType.replace)
  }
  // Redirection if no phase_name
  if (!data){
    return redirect("/", RedirectType.replace)
  }

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 2); // UTC+2

  const startDate = new Date(data.startdate);
  const endDate = new Date(data.enddate);

  const isEditable = (currentDate >= startDate) && (currentDate <= endDate);

  if (currentDate < startDate) {
    return redirect("/", RedirectType.replace)
  }

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
    <div>My Phase: {params.phase_name}
      <div>
        Test
      </div>
    </div>
  )
}