from datetime import datetime, date
from backend.utils.consts import DATETIME_FORMAT, REGEX_JS
from backend.enums.question_type import QuestionType
from typing import Any, Dict

from backend.utils.utils_file import read_yaml_file

DEFAULT_PARAMS = {
    'order': int,
    'mandatory': bool,
    'question': str,
}

# Define the specific parameters for each question type
SPECIFIC_PARAMS = {
    'maxTextLength': int,
    'minAnswers': int,
    'maxAnswers': int,
    'userInput': bool,
    'Answers': list,
    'maxFileSizeInMB': float,
    'minDate': date,
    'maxDate': date,
    'minDatetime': datetime,
    'maxDatetime': datetime,
    'minNumber': int,
    'maxNumber': int,
    'allowedFileTypes': list,
}

# Define which specific parameters are used by each question type
QUESTION_TYPE_PARAMS = {
    QuestionType.SHORT_TEXT: ['maxTextLength'],
    QuestionType.LONG_TEXT: ['maxTextLength'],
    QuestionType.MULTIPLE_CHOICE: ['minAnswers', 'maxAnswers', 'userInput', 'Answers'],
    QuestionType.VIDEO_UPLOAD: ['maxFileSizeInMB'],
    QuestionType.DATE_PICKER: ['minDate', 'maxDate'],
    QuestionType.DATETIME_PICKER: ['minDatetime', 'maxDatetime'],
    QuestionType.NUMBER_PICKER: ['minNumber', 'maxNumber'],
    QuestionType.PDF_UPLOAD: ['maxFileSizeInMB'],
    QuestionType.IMAGE_UPLOAD: ['maxFileSizeInMB'],
    QuestionType.DROPDOWN: ['minAnswers', 'maxAnswers', 'Answers', 'userInput'],
    QuestionType.CHECKBOX: [],
}

# Construct the mandatory parameters dictionary
MANDATORY_PARAMS = {
    question_type: {
        param: SPECIFIC_PARAMS[param]
        for param in params
    }
    for question_type, params in QUESTION_TYPE_PARAMS.items()
}

# Merge the default parameters with the specific ones for each question type
for question_type in MANDATORY_PARAMS:
    MANDATORY_PARAMS[question_type].update(DEFAULT_PARAMS)

OPTIONAL_PARAMS = {
    "ALL": {
        "note": str,
        "preInformationBox": str,
        "postInformationBox": str,
    },
    QuestionType.SHORT_TEXT: {
        'formattingRegex': str,
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
    QuestionType.CHECKBOX: "checkbox_question_table",
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
        if 'phaseLabel' not in phase or not isinstance(phase['phaseLabel'], str):
            raise ValueError(
                f"The phase {phase_name} is missing the 'phaseLabel' field or 'phaseLabel' is not a String.")

        if 'startDate' not in phase or not isinstance(phase['startDate'], date):
            raise ValueError(
                f"The phase {phase_name} is missing the 'startDate' field or 'startDate' is not in ISO8601 standard: {DATETIME_FORMAT}."
            )

        if 'endDate' not in phase or not isinstance(phase['endDate'], date):
            raise ValueError(
                f"The phase {phase_name} is missing the 'endDate' field or 'endDate' is not in ISO8601 standard: {DATETIME_FORMAT}."
            )
        
        sections_enabled = False
        if 'sections' in phase:
            if not isinstance(phase['sections'], list):
                raise ValueError(
                    f"The phase {phase_name} has the 'sections' field but it's is not a list.")
            for section in phase['sections']:
                if not isinstance(section, str):
                    raise ValueError(
                        f"The phase {phase_name} has the 'sections' field but the section {section} is not a string.")
            sections_enabled = True

        seen_orders_in_phase = set()
        for question in phase["questions"]:
            if 'questionType' not in question:
                raise ValueError("A question is missing the 'questionType' field.")

            this_question_type = QuestionType.str_to_enum(question['questionType'])
            if not this_question_type:
                raise ValueError(
                    f"Invalid 'questionType': {question['questionType']}. Has to be one of the followings: {QuestionType.list_enums()}"
                )

            order = question.get('order')
            if order in seen_orders_in_phase:
                raise ValueError(f"The order number {order} in phase '{phase}' is NOT Unique!")
            seen_orders_in_phase.add(order)

            for param, paramtype in MANDATORY_PARAMS.get(this_question_type, {}).items():
                if param not in question:
                    raise ValueError(
                        f"The {this_question_type} question {question} is missing the parameter '{param}' field!")
                if not isinstance(question[param], paramtype):
                    raise ValueError(
                        f"The additional parameter field '{param}' is type of {type(question[param])} instead of {paramtype}."
                    )

            for param, paramtype in OPTIONAL_PARAMS.get("ALL", {}).items():
                if param in question and not isinstance(question[param], paramtype):
                    raise ValueError(
                        f"The optional parameter field '{param}' is type of {type(question[param])} instead of {paramtype}."
                    )

            for param, paramtype in OPTIONAL_PARAMS.get(this_question_type, {}).items():
                if param in question and not isinstance(question[param], paramtype):
                    raise ValueError(
                        f"The optional parameter field '{param}' is type of {type(question[param])} instead of {paramtype}."
                    )

            if this_question_type == QuestionType.SHORT_TEXT and "formattingDescription" in question:
                if not isinstance(question[param], str):
                    raise ValueError(
                        f"The optional parameter field '{param}' is type of {type(question[param])} instead of str.")
                if "formattingRegex" not in question:
                    raise ValueError(
                        f"The optional parameter field '{param}' can't be set if formattingRegex is not Set.")
                if question["formattingRegex"] in REGEX_JS.keys():
                    raise ValueError(
                        f"The optional parameter field '{param}' can't be set if formattingRegex is one of the Predefined Values."
                    )
            
            if sections_enabled:
                if "sectionNumber" not in question:
                    raise ValueError(f"In phase {phase_name} the Sections are enabled but ne question '{question['question']}' is missing the sectionNumber!")
                if isinstance(question["sectionNumber"], int):
                    raise ValueError(
                            f"The field 'sectionNumber' is type of {type(question[param])} instead of int."
                        )
                if len(phase["sections"]) + 1 < question["sectionNumber"]:
                    raise ValueError(f"The sectionNumber {question['sectionNumber']} in question '{question['question']}' is bigger than the number of sections in this phase!")


def validate_config_structure():
    yaml_content = read_yaml_file("apl_config.yml")
    # Validate the structure of the YAML content
    try:
        run_structure_checks(yaml_content)
        print("YAML is valid.")
    except ValueError as e:
        print(f"YAML validation error: {e}")
