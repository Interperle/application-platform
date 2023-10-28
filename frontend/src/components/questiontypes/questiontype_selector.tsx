import React, { FC } from 'react';
import ShortTextQuestionType, { ShortTextQuestionTypeProps } from "@/components/questiontypes/shorttext_questiontype";
import LongTextQuestionType, { LongTextQuestionTypeProps } from "@/components/questiontypes/longtext_questiontype"
import VideoUploadQuestionType, { VideoUploadQuestionTypeProps } from "@/components/questiontypes/videoupload_questiontype";
import DateTimePickerQuestionType, { DateTimePickerQuestionTypeProps } from "@/components/questiontypes/datetimepicker_questiontype";
import DatePickerQuestionType, { DatePickerQuestionTypeProps } from "@/components/questiontypes/datepicker_questiontype";
import NumberPickerQuestionType, { NumberPickerQuestionTypeProps } from "@/components/questiontypes/numberpicker_questiontype";
import ImageUploadQuestionType, { ImageUploadQuestionTypeProps } from "@/components/questiontypes/imageupload_questiontype";
import PDFUploadQuestionType, { PDFUploadQuestionTypeProps } from '@/components/questiontypes/pdfupload_questiontype';

export enum QuestionType {
    ShortText = "shortText",
    LongText = "longText",
    NumberPicker = "numberPicker",
    DateTimePicker = "dateTimePicker",
    DatePicker = "datePicker",
    ImageUpload = "imageUpload",
    VideoUpload = "videoUpload",
    PDFUpload = "pdfUpload",
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
  };

const getQuestionComponent = (questionType: keyof QuestionTypeSelectorProps) => {
    return QuestionTypeSelector[questionType] || null;
};

export default getQuestionComponent;