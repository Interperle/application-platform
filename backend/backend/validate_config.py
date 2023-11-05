from datetime import datetime, date
from backend.utils.consts import DATETIME_FORMAT
from backend.enums.question_type import QuestionType
from typing import Any, Dict

from backend.utils.utils_file import read_yaml_file

DEFAULT_PARAMS = {
    'order': int,
    'mandatory': bool,
    'question': str,
}

ADDITIONAL_PARAMS = {
    QuestionType.SHORT_TEXT: {
        'maxTextLength': int,
    },
    QuestionType.LONG_TEXT: {
        'maxTextLength': int,
    },
    QuestionType.MULTIPLE_CHOICE: {
        'minAnswers': int,
        'maxAnswers': int,
        'userInput': bool,
        'Answers': list,
    },
    QuestionType.VIDEO_UPLOAD: {
        'maxFileSizeInMB': float,
    },
    QuestionType.DATE_PICKER: {
        'minDate': date,
        'maxDate': date,
    },
    QuestionType.DATETIME_PICKER: {
        'minDatetime': datetime,
        'maxDatetime': datetime,
    },
    QuestionType.NUMBER_PICKER: {
        'minNumber': int,
        'maxNumber': int,
    },
    QuestionType.PDF_UPLOAD: {
        'maxFileSizeInMB': float,
    },
    QuestionType.IMAGE_UPLOAD: {
        'maxFileSizeInMB': float,
        'allowedFileTypes': list,
    },
    QuestionType.DROPDOWN: {
        'minAnswers': int,
        'maxAnswers': int,
        'Answers': list,
        'userInput': bool,
    },
}

QUESTION_TYPES_DB_TABLE = {
    QuestionType.SHORT_TEXT: "short_text_question_table",
    QuestionType.LONG_TEXT: "long_text_question_table",
    QuestionType.MULTIPLE_CHOICE: "multiple_choice_question_table",
    QuestionType.VIDEO_UPLOAD: "video_upload_question_table",
    QuestionType.DATE_PICKER: "date_picker_question_table",
    QuestionType.DATETIME_PICKER: "datetime_picker_question_table",
    QuestionType.NUMBER_PICKER: "number_picker_question_table",
    QuestionType.PDF_UPLOAD: "pdf_upload_question_table",
    QuestionType.IMAGE_UPLOAD: "image_upload_question_table",
    QuestionType.DROPDOWN: "dropdown_question_table",
}


def run_structure_checks(yaml_data: Dict[str, Any]) -> None:
    # Check if 'questions' is in the YAML
    if 'questions' not in yaml_data:
        raise ValueError("'questions' not found in the YAML data.")

    # Check if at least one phase is inside 'questions'
    if not yaml_data['questions']:
        raise ValueError("No Phases found in 'questions'.")

    # Check for necessary fields in each question
    for phase_name, phase in yaml_data['questions'].items():
        if 'startDate' not in phase or not isinstance(phase['startDate'], date):
            raise ValueError(
                f"The phase {phase_name} is missing the 'startDate' field or 'startDate' is not in ISO8601 standard: {DATETIME_FORMAT}."
            )

        if 'endDate' not in phase or not isinstance(phase['endDate'], date):
            raise ValueError(
                f"The phase {phase_name} is missing the 'endDate' field or 'endDate' is not in ISO8601 standard: {DATETIME_FORMAT}."
            )

        seen_orders_in_phase = set()
        for question in phase["questions"]:
            if 'questionType' not in question:
                raise ValueError("A question is missing the 'questionType' field.")

            question_type = QuestionType.str_to_enum(question['questionType'])
            if not question_type:
                raise ValueError(
                    f"Invalid 'questionType': {question['questionType']}. Has to be one of the followings: {QuestionType.list_enums()}"
                )

            for param, paramtype in DEFAULT_PARAMS.items():
                if param not in question or not isinstance(question[param], paramtype):
                    raise ValueError(
                        f"The {question_type} question {question} is missing the default '{param}' field or it's not type of {paramtype}."
                    )

            order = question.get('order')
            if order in seen_orders_in_phase:
                raise ValueError(f"The order number {order} in phase {phase} is NOT Unique!")
            seen_orders_in_phase.add(order)

            for param, paramtype in ADDITIONAL_PARAMS.get(question_type, {}).items():
                if param not in question:
                    raise ValueError(
                        f"The {question_type} question {question} is missing the additional '{param}' field or it's not type of {paramtype}."
                    )
                if not isinstance(question[param], paramtype):
                    raise ValueError(
                        f"The additional parameter field '{param}' is type of {type(question[param])} instead of {paramtype}."
                    )


def validate_config_structure():
    yaml_content = read_yaml_file("apl_config.yml")
    # Validate the structure of the YAML content
    try:
        run_structure_checks(yaml_content)
        print("YAML is valid.")
    except ValueError as e:
        print(f"YAML validation error: {e}")
