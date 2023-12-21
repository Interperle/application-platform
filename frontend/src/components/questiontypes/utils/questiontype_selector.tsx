import { FC } from "react";

import DatePickerQuestionType, {
  DatePickerQuestionTypeProps,
} from "@/components/questiontypes/datepicker_questiontype";
import DatetimePickerQuestionType, {
  DatetimePickerQuestionTypeProps,
} from "@/components/questiontypes/datetimepicker_questiontype";
import ImageUploadQuestionType, {
  ImageUploadQuestionTypeProps,
} from "@/components/questiontypes/imageupload_questiontype";
import LongTextQuestionType, {
  LongTextQuestionTypeProps,
} from "@/components/questiontypes/longtext_questiontype";
import NumberPickerQuestionType, {
  NumberPickerQuestionTypeProps,
} from "@/components/questiontypes/numberpicker_questiontype";
import PDFUploadQuestionType, {
  PDFUploadQuestionTypeProps,
} from "@/components/questiontypes/pdfupload_questiontype";
import ShortTextQuestionType, {
  ShortTextQuestionTypeProps,
} from "@/components/questiontypes/shorttext_questiontype";
import VideoUploadQuestionType, {
  VideoUploadQuestionTypeProps,
} from "@/components/questiontypes/videoupload_questiontype";

import CheckBoxQuestionType, {
  CheckBoxQuestionTypeProps,
} from "../checkbox_questiontype";
import ConditionalQuestionType, {
  ConditionalQuestionTypeProps,
} from "../conditional_questiontype";
import DropdownQuestionType, {
  DropdownQuestionTypeProps,
} from "../dropdown_questiontype";
import MultipleChoiceQuestionType, {
  MultipleChoiceQuestionTypeProps,
} from "../multiplechoice_questiontype";

export enum QuestionType {
  ShortText = "shortText",
  LongText = "longText",
  NumberPicker = "numberPicker",
  DatetimePicker = "datetimePicker",
  DatePicker = "datePicker",
  ImageUpload = "imageUpload",
  VideoUpload = "videoUpload",
  PDFUpload = "pdfUpload",
  MultipleChoice = "multipleChoice",
  Dropdown = "dropdown",
  CheckBox = "checkBox",
  Conditional = "conditional",
}

export enum QuestionTypeTable {
  ShortTextQuestionTable = "short_text_question_table",
  LongTextQuestionTable = "long_text_question_table",
  NumberPickerQuestionTable = "number_picker_question_table",
  DatetimePickerQuestionTable = "datetime_picker_question_table",
  DatePickerQuestionTable = "date_picker_question_table",
  ImageUploadQuestionTable = "image_upload_question_table",
  VideoUploadQuestionTable = "image_upload_question_table",
  PdfUploadQuestionTable = "pdf_upload_question_table",
  MultipleChoiceQuestionTable = "multiple_choice_question_table",
  DropdownQuestionTable = "dropdown_question_table",
  CheckBoxQuestionTable = "checkbox_question_table",
  ConditionalQuestionTable = "conditional_question_table",
}

export enum AnswerTypeTable {
  ShortTextAnswerTable = "short_text_answer_table",
  LongTextAnswerTable = "long_text_answer_table",
  NumberPickerAnswerTable = "number_picker_answer_table",
  DatetimePickerAnswerTable = "datetime_picker_answer_table",
  DatePickerAnswerTable = "date_picker_answer_table",
  ImageUploadAnswerTable = "image_upload_answer_table",
  VideoUploadAnswerTable = "image_upload_answer_table",
  PdfUploadAnswerTable = "pdf_upload_answer_table",
  MultipleChoiceAnswerTable = "multiple_choice_answer_table",
  DropdownAnswerTable = "dropdown_answer_table",
  CheckBoxAnswerTable = "checkbox_answer_table",
  ConditionalAnswerTable = "conditional_answer_table",
}

type QuestionTypeSelectorProps = {
  shortText: FC<ShortTextQuestionTypeProps>;
  longText: FC<LongTextQuestionTypeProps>;
  videoUpload: FC<VideoUploadQuestionTypeProps>;
  datetimePicker: FC<DatetimePickerQuestionTypeProps>;
  datePicker: FC<DatePickerQuestionTypeProps>;
  numberPicker: FC<NumberPickerQuestionTypeProps>;
  imageUpload: FC<ImageUploadQuestionTypeProps>;
  pdfUpload: FC<PDFUploadQuestionTypeProps>;
  multipleChoice: FC<MultipleChoiceQuestionTypeProps>;
  dropdown: FC<DropdownQuestionTypeProps>;
  checkBox: FC<CheckBoxQuestionTypeProps>;
  conditional: FC<ConditionalQuestionTypeProps>;
};

const QuestionTypeSelector: QuestionTypeSelectorProps = {
  shortText: ShortTextQuestionType,
  longText: LongTextQuestionType,
  videoUpload: VideoUploadQuestionType,
  datetimePicker: DatetimePickerQuestionType,
  datePicker: DatePickerQuestionType,
  numberPicker: NumberPickerQuestionType,
  imageUpload: ImageUploadQuestionType,
  pdfUpload: PDFUploadQuestionType,
  multipleChoice: MultipleChoiceQuestionType,
  dropdown: DropdownQuestionType,
  checkBox: CheckBoxQuestionType,
  conditional: ConditionalQuestionType,
};

const getQuestionComponent = (
  questionType: keyof QuestionTypeSelectorProps,
) => {
  return QuestionTypeSelector[questionType] || null;
};

export default getQuestionComponent;
