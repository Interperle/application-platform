from datetime import datetime
from backend.logger import Logger
from backend.utils.consts import DATETIME_FORMAT
from backend.utils.utils_file import read_yaml_file
from backend.utils.utils_supabase import init_supabase
from backend.enums.question_type import QuestionType
from backend.validate_config import ADDITIONAL_PARAMS, QUESTION_TYPES_DB_TABLE, run_structure_checks

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
            data_question_table = create_data_questions_table(question_type, question["order"], phase_id,
                                                              question["mandatory"], question["question"])
            log.info(f"Create Question '{question}'")
            response_question_table = supabase.table("question_table").insert(data_question_table).execute()
            log.info(str(response_question_table))
            log.info(f"Create QuestionType {question_type}")
            question_id = response_question_table.data[0]["questionid"]
            data_question_type_table = create_data_question_types_table(question_id)
            param: str
            for param in ADDITIONAL_PARAMS.get(question_type, {}):
                if param != "Answers":
                    data_question_type_table[param.lower()] = str(question[param])
            response_question_type_table = supabase.table(
                QUESTION_TYPES_DB_TABLE[question_type]).insert(data_question_type_table).execute()
            log.info(str(response_question_type_table))
            if question_type == QuestionType.MULTIPLE_CHOICE:
                for answer in question["Answers"]:
                    data_list_table = create_data_choice_table(question_id, answer)
                    table_name = "multiple_choice_question_choice_table"
                    response_list_table = supabase.table(table_name).insert(data_list_table).execute()
                    log.info(str(response_list_table))
            elif question_type == QuestionType.DROPDOWN:
                for answer in question["Answers"]:
                    data_list_table = create_data_option_table(question_id, answer)
                    table_name = "dropdown_question_option_table"
                    response_list_table = supabase.table(table_name).insert(data_list_table).execute()
                    log.info(str(response_list_table))
        log.info(f"Processed Phase {phase} successfully")


def create_data_phase_table(phasename: str, ordernumber: int, startdate: datetime, enddate: datetime):
    return {
        "phasename": phasename,
        "phaseorder": ordernumber,
        "startdate": startdate.strftime(DATETIME_FORMAT),
        "enddate": enddate.strftime(DATETIME_FORMAT),
    }


def create_data_questions_table(questiontype: QuestionType, ordernumber: int, phaseid: str, mandatory: bool,
                                question: str):
    return {
        "questiontype": str(questiontype),
        "questionorder": ordernumber,
        "phaseid": phaseid,
        "mandatory": 1 if mandatory else 0,
        "questiontext": question,
    }


def create_data_question_types_table(question_id: str):
    return {
        "questionid": question_id,
    }


def create_data_choice_table(questionId: str, choiceText: str):
    return {
        "questionid": questionId,
        "choicetext": choiceText,
    }


def create_data_option_table(questionId: str, optionText: str):
    return {
        "questionid": questionId,
        "optiontext": optionText,
    }
