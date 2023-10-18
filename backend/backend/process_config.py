from backend.logger import Logger
from datetime import datetime
from backend.utils.consts import DATETIME_FORMAT
from backend.utils.utils_file import read_yaml_file
from backend.utils.utils_supabase import init_supabase
from backend.enums.question_type import QuestionType
from backend.validate_config import run_structure_checks


log = Logger(__name__)

def process_config():
    config_data = read_yaml_file("apl_config.yml")
    run_structure_checks(config_data)

    supabase = init_supabase()
    phase_counter = 1
    for phase_name, phase in config_data['questions'].items():
        data_phase_table = create_data_phase_table(phase_name, phase_counter, phase['startDate'], phase['endDate'])
        log.info(f"Create Phase {phase}")
        response_phase_table = supabase.table("phase_table").insert(data_phase_table).execute()
        log.info(str(response_phase_table))
        phase_id = response_phase_table.data[0]["phaseid"]
        phase_counter += 1
        for question in phase["questions"]:
            question_type = QuestionType.str_to_enum(question['questionType'])
            data_question_table = create_data_questions_table(question_type, question["order"], phase_id, question["mandatory"])
            log.info(f"Create Question '{question}'")
            response_question_table = supabase.table("question_table").insert(data_question_table).execute()
            log.info(str(response_question_table))
            log.info(f"Create QuestionType {question_type}")
            question_id = response_question_table.data[0]["questionid"]
            data_question_type_table = create_data_question_types_table(question_id, question["question"])
            if question_type == QuestionType.SHORT_TEXT:
                response_question_type_table = supabase.table("short_text_question_table").insert(data_question_type_table).execute()
            elif question_type == QuestionType.LONG_TEXT:
                response_question_type_table = supabase.table("long_text_question_table").insert(data_question_type_table).execute()
            elif question_type == QuestionType.MULTIPLE_CHOICE:
                data_question_type_table["numberofpossibleanswers"] = question["numberOfPossibleAnswers"]
                response_question_type_table = supabase.table("multiple_choice_question_table").insert(data_question_type_table).execute()
                for answer in question["Answers"]:
                    data_choice_table = create_data_choice_table(question_id, answer)
                    response_question_type_table = supabase.table("multiple_choice_question_choices_table").insert(data_choice_table).execute()
            elif question_type == QuestionType.VIDEO_QUESTION:
                response_question_type_table = supabase.table("video_question_table").insert(data_question_type_table).execute()
            else:
                raise ValueError("No other QuestionTypes defined!")
            log.info(str(response_question_type_table))
        log.info(f"Processed Phase {phase} successfully")


def create_data_phase_table(phasename: str, ordernumber: int, startdate: datetime, enddate: datetime):
    return {
        "phasename": phasename,
        "ordernumber": ordernumber,
        "startdate": startdate.strftime(DATETIME_FORMAT),
        "enddate": enddate.strftime(DATETIME_FORMAT),
    }


def create_data_questions_table(questiontype: QuestionType, ordernumber: int, phaseid: str, mandatory: bool):
    return {
        "questiontype": str(questiontype),
        "ordernumber": ordernumber,
        "phaseid": phaseid,
        "mandatory": 1 if mandatory else 0,
    }


def create_data_question_types_table(question_id: str, question: str):
    return {
        "questionid": question_id,
        "questiontext": question,
    }


def create_data_choice_table(questionId: str, choiceText: str):
    return {
        "questionid": questionId,
        "choicetext": choiceText,
    }
