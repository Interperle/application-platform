from datetime import datetime
from backend.utils.utils_datetime import convert_to_timezone
from backend.logger import Logger
from backend.utils.consts import REGEX_TO_DESCRIPTION
from backend.utils.utils_file import read_yaml_file
from backend.utils.utils_supabase import init_supabase
from backend.enums.question_type import QuestionType
from backend.validate_config import DEFAULT_PARAMS, MANDATORY_PARAMS, OPTIONAL_PARAMS, QUESTION_TYPES_DB_TABLE, run_structure_checks
from backend.utils.consts import REGEX_JS

log = Logger(__name__)


def process_nested_questions(nested_questions, phase_id, phase_sections, supabase, depends_on):
    for order, nested_question in enumerate(nested_questions):
        nested_question["order"] = order + 1
        process_question(nested_question, phase_id, phase_sections, supabase, depends_on)


def process_question(question, phase_id, phase_sections, supabase, depends_on=None):
    question_type = QuestionType.str_to_enum(question['questionType'])

    section_number = question.get('sectionNumber')
    data_question_table = create_data_questions_table(question_type, question['order'], phase_id, question['mandatory'],
                                                      question['question'], question.get('note', ''),
                                                      question.get('preInformationBox', ''),
                                                      question.get('postInformationBox',
                                                                   ''), phase_sections, section_number, depends_on)

    log.debug(f'Create Question "{question}"')
    response_question_table = supabase.table('question_table').insert(data_question_table).execute()

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
                response_list_table = supabase.table('dropdown_question_option_table').insert(data_list_table).execute()
                log.info(str(response_list_table))
            except Exception:
                log.info('Failed to insert data into dropdown_question_option_table')
    elif question_type == QuestionType.CONDITIONAL:
        for answer in question['Answers']:
            data_conditional_choice_table = create_data_conditional_choice_table(question_id, answer["value"])
            response_conditional_choice_table = supabase.table("conditional_question_choice_table").insert(
                data_conditional_choice_table).execute()
            process_nested_questions(answer['questions'], phase_id, phase_sections, supabase,
                                     response_conditional_choice_table.data[0]['choiceid'])


def process_config():
    config_data = read_yaml_file('apl_config.yml')
    run_structure_checks(config_data)

    supabase = init_supabase()

    for phase_counter, (phase_name, phase) in enumerate(config_data['questions'].items()):
        data_phase_table = create_data_phase_table(phase_name, phase['phaseLabel'], phase_counter, phase['startDate'],
                                                   phase['endDate'], 'sections' in phase)
        log.info(f'Create Phase {phase}')

        response_phase_table = supabase.table('phase_table').insert(data_phase_table).execute()
        phase_sections = {}
        phase_id = response_phase_table.data[0]['phaseid']
        if "sections" in phase:
            for order, section in enumerate(phase["sections"]):
                data_section_table = create_data_section_table(section["name"], section["description"], order + 1,
                                                               phase_id)
                response_section_table = supabase.table('sections_table').insert(data_section_table).execute()
                phase_sections[order + 1] = response_section_table.data[0]["sectionid"]
        log.info(str(response_phase_table))

        for question in phase['questions']:
            process_question(question, phase_id, phase_sections, supabase)
    log.info(f'Processed Phase {phase} successfully')


def create_data_phase_table(phasename: str, phaselabel: str, ordernumber: int, startdate: datetime, enddate: datetime,
                            sectionsenabled: bool) -> dict:
    return {
        'phasename': phasename,
        'phaselabel': phaselabel,
        'phaseorder': ordernumber,
        'startdate': convert_to_timezone(startdate),
        'enddate': convert_to_timezone(enddate),
        'sectionsenabled': sectionsenabled,
    }


def create_data_section_table(sectionname: str, sectiondescription: str, sectionorder: int, phaseid: str) -> dict:
    return {
        'sectionname': sectionname,
        'sectiondescription': sectiondescription,
        'sectionorder': sectionorder,
        'phaseid': phaseid
    }


def create_data_questions_table(questiontype: QuestionType, ordernumber: int, phaseid: str, mandatory: bool,
                                question: str, questionnote: str, preinformationbox: str, postinformationbox: str,
                                sections: dict, section_number, depends_on: str = None) -> dict:
    return {
        'questiontype': str(questiontype),
        'questionorder': ordernumber,
        'phaseid': phaseid,
        'mandatory': 1 if mandatory else 0,
        'questiontext': question,
        'questionnote': questionnote,
        'preinformationbox': preinformationbox,
        'postinformationbox': postinformationbox,
        'sectionid': sections.get(section_number),
        'depends_on': depends_on
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
            data_question_type_table["formattingdescription"] = REGEX_TO_DESCRIPTION.get(
                question_type, question.get("formattingDescription", None))
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


def create_data_conditional_choice_table(questionId: str, choiceValue: str) -> dict:
    return {
        'questionid': questionId,
        'choicevalue': choiceValue,
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


def add_phase_questions():
    config_data = read_yaml_file('apl_config.yml')
    run_structure_checks(config_data)

    supabase = init_supabase()

    for phase_counter, (phase_name, phase) in enumerate(config_data['questions'].items()):
        if phase_counter != 2:
            continue
        phase_sections = {}
        phase_id = "2a7c1a2c-9cb5-4bc4-8101-b2adf89972af"

        for question in phase['questions']:
            process_question(question, phase_id, phase_sections, supabase)
    log.info(f'Processed Phase {phase} successfully')


def add_test_user():
    users = ["marib.aldoais@gmail.com"]
    passwort = "HalloWelt2341"
    supabase = init_supabase()
    for user in users:
        res_user = supabase.auth.sign_up({"email": user, "password": passwort})
        user_id = res_user.user.id
        supabase.table("application_table").insert({"userid": user_id}).execute()
        supabase.table("user_profiles_table").insert({"userid": user_id, "userrole": 1, "isactive": True}).execute()
    print("Done")
