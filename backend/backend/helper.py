tables = [
    #"ANSWER_TABLE",
    #"APPLICATION_TABLE",
    "DATETIME_PICKER_ANSWER_TABLE",
    #"DATETIME_PICKER_QUESTION_TABLE",
    "DATE_PICKER_ANSWER_TABLE",
    #"DATE_PICKER_QUESTION_TABLE",
    "DROPDOWN_ANSWER_TABLE",
    #"DROPDOWN_QUESTION_OPTION_TABLE",
    #"DROPDOWN_QUESTION_TABLE",
    "IMAGE_UPLOAD_ANSWER_TABLE",
    #"IMAGE_UPLOAD_QUESTION_TABLE",
    "LONG_TEXT_ANSWER_TABLE",
    #"LONG_TEXT_QUESTION_TABLE",
    "MULTIPLE_CHOICE_ANSWER_TABLE",
    #"MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE",
    #"MULTIPLE_CHOICE_QUESTION_TABLE",
    "NUMBER_PICKER_ANSWER_TABLE",
    #"NUMBER_PICKER_QUESTION_TABLE",
    "PDF_UPLOAD_ANSWER_TABLE",
    #"PDF_UPLOAD_QUESTION_TABLE",
    #"PHASE_TABLE",
    #"QUESTION_TABLE",
    "SHORT_TEXT_ANSWER_TABLE",
    #"SHORT_TEXT_QUESTION_TABLE",
    #"USER_PROFILES_TABLE",
    #"USER_ROLES_TABLE",
    "VIDEO_UPLOAD_ANSWER_TABLE",
    #"VIDEO_UPLOAD_QUESTION_TABLE"
]


# Function to generate the policy script for a given table
def generate_policy_script(table_name):
    return f"""
CREATE POLICY select_reviewer_{table_name}
ON {table_name}
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON {table_name}.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);
"""


def kill_policy_script(table_name):
    return f"DROP POLICY IF EXISTS select_reviewer_{table_name.lower()} ON {table_name};"


# Generate and print the scripts for all tables
for table in tables:
    print(generate_policy_script(table))
    print()
