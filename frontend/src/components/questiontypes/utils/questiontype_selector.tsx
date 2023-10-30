import { FC } from 'react';
import ShortTextQuestionType, { ShortTextQuestionTypeProps } from "@/components/questiontypes/shorttext_questiontype";
import LongTextQuestionType, { LongTextQuestionTypeProps } from "@/components/questiontypes/longtext_questiontype"
import VideoUploadQuestionType, { VideoUploadQuestionTypeProps } from "@/components/questiontypes/videoupload_questiontype";
import DateTimePickerQuestionType, { DateTimePickerQuestionTypeProps } from "@/components/questiontypes/datetimepicker_questiontype";
import DatePickerQuestionType, { DatePickerQuestionTypeProps } from "@/components/questiontypes/datepicker_questiontype";
import NumberPickerQuestionType, { NumberPickerQuestionTypeProps } from "@/components/questiontypes/numberpicker_questiontype";
import ImageUploadQuestionType, { ImageUploadQuestionTypeProps } from "@/components/questiontypes/imageupload_questiontype";
import PDFUploadQuestionType, { PDFUploadQuestionTypeProps } from '@/components/questiontypes/pdfupload_questiontype';
import MultipleChoiceQuestionType, { MultipleChoiceQuestionTypeProps } from '../multiplechoice_questiontype';
import DropdownQuestionType, { DropdownQuestionTypeProps } from '../dropdown_questiontype';

export enum QuestionType {
    ShortText = "shortText",
    LongText = "longText",
    NumberPicker = "numberPicker",
    DateTimePicker = "dateTimePicker",
    DatePicker = "datePicker",
    ImageUpload = "imageUpload",
    VideoUpload = "videoUpload",
    PDFUpload = "pdfUpload",
    MultipleChoice = "multipleChoice",
    Dropdown = "dropdown",
}

export enum QuestionTypeTable {
    ShortTextQuestionTable = "short_text_question_table",
    LongTextQuestionTable = "long_text_question_table",
    //NumberPickerQuestionTable = "MISSING",
    //DateTimePickerQuestionTable = "MISSING",
    //DatePickerQuestionTable = "MISSING",
    //ImageUploadQuestionTable = "MISSING",
    VideoUploadQuestionTable = "video_question_table",
    //PDFUploadQuestionTable = "MISSING",
    MultipleChoiceQuestionTable = "multiple_choice_question_table",
    //DropdownQuestionTable = "MISSING",
}

type QuestionTypeSelectorProps = {
    shortText: FC<ShortTextQuestionTypeProps>,
    longText: FC<LongTextQuestionTypeProps>,
    videoUpload: FC<VideoUploadQuestionTypeProps>,
    dateTimePicker: FC<DateTimePickerQuestionTypeProps>,
    datePicker: FC<DatePickerQuestionTypeProps>,
    numberPicker: FC<NumberPickerQuestionTypeProps>,
    imageUpload: FC<ImageUploadQuestionTypeProps>,
    pdfUpload: FC<PDFUploadQuestionTypeProps>,
    multipleChoice: FC<MultipleChoiceQuestionTypeProps>,
    dropdown: FC<DropdownQuestionTypeProps>,
}


const QuestionTypeSelector: QuestionTypeSelectorProps = {
    shortText: ShortTextQuestionType,
    longText: LongTextQuestionType,
    videoUpload: VideoUploadQuestionType,
    dateTimePicker: DateTimePickerQuestionType,
    datePicker: DatePickerQuestionType,
    numberPicker: NumberPickerQuestionType,
    imageUpload: ImageUploadQuestionType,
    pdfUpload: PDFUploadQuestionType,
    multipleChoice: MultipleChoiceQuestionType,
    dropdown: DropdownQuestionType,
  };

const getQuestionComponent = (questionType: keyof QuestionTypeSelectorProps) => {
    return QuestionTypeSelector[questionType] || null;
};

export default getQuestionComponent;