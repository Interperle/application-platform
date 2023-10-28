import ShortTextQuestionType from "@/components/questiontypes/shorttext_questiontype";
import LongTextQuestionType from "@/components/questiontypes/longtext_questiontype"
import VideoUploadQuestionType from "@/components/questiontypes/videoupload_questiontype";
import DateTimePickerQuestionType from "@/components/questiontypes/datetimepicker_questiontype";
import DatePickerQuestionType from "@/components/questiontypes/datepicker_questiontype";
import NumberPickerQuestionType from "@/components/questiontypes/numberpicker_questiontype";
import ImageUploadQuestionType from "@/components/questiontypes/imageupload_questiontype";

export default function Page({ params }: { params: { phase_name: string } }) {
  return <div>My Phase: {params.phase_name}
  <form>
      <ShortTextQuestionType
        id="question1"
        mandatory={true}
        question_text="What is your name?"
      />
      <LongTextQuestionType
        id="question2"
        mandatory={true}
        question_text="Describe where you're coming from!"
      />
      <VideoUploadQuestionType
        id="question3"
        mandatory={true}
        question_text="Please upload your interview!"
      />
      <DateTimePickerQuestionType
        id="dateTimePicker1"
        mandatory={true}
        question_text="Please pick a date and time"
      />
      <DatePickerQuestionType
        id="datePicker1"
        mandatory={true}
        question_text="Please pick a date"
      />
      <NumberPickerQuestionType
        id="numberPicker1"
        mandatory={true}
        question_text="Please pick a number"
        min={1}
        max={100}
      />
      <ImageUploadQuestionType
        id="imageUpload1"
        mandatory={true}
        question_text="Please upload an image"
      />
    </form>
  </div>
}