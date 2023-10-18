import datetime
from backend.utils.consts import DATETIME_FORMAT
from backend.enums.question_type import QuestionType
from typing import Any, Dict

from backend.utils.utils_file import read_yaml_file


def run_structure_checks(yaml_data: Dict[str, Any]) -> None:
    # Check if 'questions' is in the YAML
    if 'questions' not in yaml_data:
        raise ValueError("'questions' not found in the YAML data.")

    # Check if at least one phase is inside 'questions'
    if not yaml_data['questions']:
        raise ValueError("No Phases found in 'questions'.")

    # Check for necessary fields in each question
    for phase_name, phase in yaml_data['questions'].items():
        if 'startDate' not in phase or not isinstance(phase['startDate'], datetime.date):
            raise ValueError(f"The phase {phase_name} is missing the 'startDate' field or 'startDate' is not in ISO8601 standard: {DATETIME_FORMAT}.")

        if 'endDate' not in phase or not isinstance(phase['endDate'], datetime.date):
            raise ValueError(f"The phase {phase_name} is missing the 'endDate' field or 'endDate' is not in ISO8601 standard: {DATETIME_FORMAT}.")

        seen_orders_in_phase = set()
        for question in phase["questions"]:
            if 'questionType' not in question:
                raise ValueError("A question is missing the 'questionType' field.")

            question_type = QuestionType.str_to_enum(question['questionType'])
            if not question_type:
                raise ValueError(f"Invalid 'questionType': {question['questionType']}. Has to be one of the followings: {QuestionType.list_enums()}")

            if 'order' not in question or not isinstance(question['order'], int):
                raise ValueError("A question is missing the 'order' field or 'order' is not an integer.")

            order = question.get('order')
            if order in seen_orders_in_phase:
                raise ValueError(f"The order number {order} in phase {phase} is NOT Unique!")
            seen_orders_in_phase.add(order)

            if 'question' not in question:
                raise ValueError("A question is missing the 'question' field.")

            if 'mandatory' not in question or not isinstance(question['mandatory'], bool):
                raise ValueError("A question is missing the 'mandatory' field or 'mandatory' is not boolean.")

            if question_type == QuestionType.MULTIPLE_CHOICE:
                if 'numberOfPossibleAnswers' not in question or not isinstance(question['numberOfPossibleAnswers'], int):
                    raise ValueError("A multipleChoice question is missing the 'numberOfPossibleAnswers' field or it's not an integer.")

                if 'Answers' not in question or not isinstance(question['Answers'], list):
                    raise ValueError("A multipleChoice question is missing the 'Answers' field or it's not a list.")


def validate_config_structure():
    yaml_content = read_yaml_file("apl_config.yml")
    # Validate the structure of the YAML content
    try:
        run_structure_checks(yaml_content)
        print("YAML is valid.")
    except ValueError as e:
        print(f"YAML validation error: {e}")
