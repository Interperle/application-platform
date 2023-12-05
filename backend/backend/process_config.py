from datetime import datetime
from backend.logger import Logger
from backend.utils.consts import DATETIME_FORMAT
from backend.utils.utils_file import read_yaml_file
from backend.utils.utils_supabase import init_supabase
from backend.enums.question_type import QuestionType
from backend.validate_config import DEFAULT_PARAMS, MANDATORY_PARAMS, OPTIONAL_PARAMS, QUESTION_TYPES_DB_TABLE, run_structure_checks
from backend.utils.consts import REGEX_JS

log = Logger(__name__)


def process_config():
    config_data = read_yaml_file('apl_config.yml')
    run_structure_checks(config_data)

    supabase = init_supabase()

    for phase_counter, (phase_name, phase) in enumerate(config_data['questions'].items()):
        data_phase_table = create_data_phase_table(phase_name, phase['phaseLabel'], phase_counter, phase['startDate'],
                                                   phase['endDate'])
        log.info(f'Create Phase {phase}')

        response_phase_table = supabase.table('phase_table').insert(data_phase_table).execute()
        log.info(str(response_phase_table))

        phase_id = response_phase_table.data[0]['phaseid']
        for question in phase['questions']:
            question_type = QuestionType.str_to_enum(question['questionType'])
            data_question_table = create_data_questions_table(question_type, question['order'], phase_id,
                                                              question['mandatory'], question['question'],
                                                              question.get('note', ''))

            log.debug(f'Create Question "{question}"')
            response_question_table = supabase.table('question_table').insert(data_question_table).execute()
            log.info(str(response_question_table))

            log.debug(f'Create QuestionType {question_type}')
            question_id = response_question_table.data[0]['questionid']
            data_question_type_table = create_data_question_type_table(question_id, question_type, question)

            response_question_type_table = supabase.table(QUESTION_TYPES_DB_TABLE[question_type]) \
                                                                        .insert(data_question_type_table).execute()
            log.info(str(response_question_type_table))
            if question_type in [QuestionType.PDF_UPLOAD, QuestionType.IMAGE_UPLOAD, QuestionType.VIDEO_UPLOAD]:
                file_type = ""
                if question_type == QuestionType.PDF_UPLOAD:
                    file_type = "pdf"
                    allowed_mime_types = ["application/pdf"]
                elif question_type == QuestionType.VIDEO_UPLOAD:
                    file_type = "video"
                    allowed_mime_types = ["video/mp4"]
                elif question_type == QuestionType.IMAGE_UPLOAD:
                    file_type = "image"
                    allowed_mime_types = ["image/png", "image/jpeg"]
                create_file_storage(file_type, question_id, question["maxFileSizeInMB"], allowed_mime_types)
            elif question_type == QuestionType.MULTIPLE_CHOICE:
                for answer in question['Answers']:
                    data_list_table = create_data_choice_table(question_id, answer)
                    try:
                        response_list_table = supabase.table('multiple_choice_question_choice_table').insert(
                            data_list_table).execute()
                        log.info(str(response_list_table))
                    except Exception:
                        log.info('Failed to insert data into multiple_choice_question_choice_table')
            elif question_type == QuestionType.DROPDOWN:
                for answer in question['Answers']:
                    data_list_table = create_data_option_table(question_id, answer)
                    try:
                        response_list_table = supabase.table('dropdown_question_option_table').insert(
                            data_list_table).execute()
                        log.info(str(response_list_table))
                    except Exception:
                        log.info('Failed to insert data into dropdown_question_option_table')
        log.info(f'Processed Phase {phase} successfully')


def create_data_phase_table(phasename: str, phaselabel: str, ordernumber: int, startdate: datetime,
                            enddate: datetime) -> dict:
    return {
        'phasename': phasename,
        'phaselabel': phaselabel,
        'phaseorder': ordernumber,
        'startdate': startdate.strftime(DATETIME_FORMAT),
        'enddate': enddate.strftime(DATETIME_FORMAT),
    }


def create_data_questions_table(questiontype: QuestionType, ordernumber: int, phaseid: str, mandatory: bool,
                                question: str, questionnote: str) -> dict:
    return {
        'questiontype': str(questiontype),
        'questionorder': ordernumber,
        'phaseid': phaseid,
        'mandatory': 1 if mandatory else 0,
        'questiontext': question,
        'questionnote': questionnote,
    }


def create_data_question_type_table(question_id: str, question_type: str, question: dict) -> dict:
    data_question_type_table = {'questionid': question_id}
    for param in MANDATORY_PARAMS.get(question_type, {}):
        if param != 'Answers' and param.lower() not in DEFAULT_PARAMS:
            data_question_type_table[param.lower()] = str(question[param])
    for opt_param in OPTIONAL_PARAMS.get(question_type, {}):
        if opt_param not in question:
            continue
        if opt_param == 'formattingRegex':
            data_question_type_table[opt_param.lower()] = REGEX_JS.get(question[opt_param], None)
    return data_question_type_table


def create_data_choice_table(questionId: str, choiceText: str) -> dict:
    return {
        'questionid': questionId,
        'choicetext': choiceText,
    }


def create_data_option_table(questionId: str, optionText: str) -> dict:
    return {
        'questionid': questionId,
        'optiontext': optionText,
    }


def create_file_storage(filetype: str, questionid: str, fileSizeLimitInMB: int, allowedMimeTypes: list):
    supabase = init_supabase()
    bucket_name = f"{filetype}-{questionid}"
    response = supabase.storage.create_bucket(bucket_name, bucket_name, {
        "public": False,
        "file_size_limit": fileSizeLimitInMB * (2**20),
        "allowed_mime_types": allowedMimeTypes
    })
    log.info(str(response))
