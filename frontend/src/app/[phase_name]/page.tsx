import Questionnaire from "@/components/questions";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";




export default function Page({ params }: { params: { phase_name: string } }) {
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

  return (
    <div>My Phase: {params.phase_name}
      <form>
          <Questionnaire questions={questionsData} />
        </form>
    </div>
  )
}