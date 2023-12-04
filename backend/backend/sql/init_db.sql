-- Enable the UUID extension
CREATE EXTENSION
  IF NOT EXISTS "uuid-ossp";

CREATE TABLE
  APPLICATION_TABLE (
    applicationid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    userid UUID NOT NULL REFERENCES auth.users (id) on delete cascade
  );

ALTER TABLE
  APPLICATION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  PHASE_TABLE (
    phaseid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    phasename VARCHAR(255) NOT NULL,
    phaseorder INT NOT NULL,
    startdate TIMESTAMPTZ NOT NULL,
    enddate TIMESTAMPTZ NOT NULL
  );

ALTER TABLE
  PHASE_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questiontype VARCHAR(255) NOT NULL,
    questionorder INT NOT NULL,
    phaseid UUID NOT NULL REFERENCES PHASE_TABLE (phaseid),
    mandatory BOOLEAN NOT NULL,
    questiontext TEXT NOT NULL,
    questionnote VARCHAR(255)
  );

ALTER TABLE
  QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  ANSWER_TABLE (
    answerid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL REFERENCES QUESTION_TABLE (questionid),
    applicationid UUID NOT NULL REFERENCES APPLICATION_TABLE (applicationid),
    created TIMESTAMPTZ NOT NULL,
    lastUpdated TIMESTAMPTZ NOT NULL
  );

ALTER TABLE
  ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  SHORT_TEXT_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxtextlength INT NOT NULL,
    formattingregex VARCHAR(255)
  );

ALTER TABLE
  SHORT_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  LONG_TEXT_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxtextlength INT NOT NULL
  );

ALTER TABLE
  LONG_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  MULTIPLE_CHOICE_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    minanswers INT NOT NULL,
    maxanswers INT NOT NULL,
    userinput BOOLEAN NOT NULL,
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid)
  );

ALTER TABLE
  MULTIPLE_CHOICE_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE (
    choiceid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL,
    choicetext VARCHAR(255) NOT NULL,
    FOREIGN KEY (questionid) REFERENCES MULTIPLE_CHOICE_QUESTION_TABLE (questionid)
  );

ALTER TABLE
  MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  VIDEO_UPLOAD_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxfilesizeinmb DECIMAL NOT NULL
  );

ALTER TABLE
  VIDEO_UPLOAD_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DATE_PICKER_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    mindate DATE NOT NULL,
    maxdate DATE NOT NULL
  );

ALTER TABLE
  DATE_PICKER_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DATETIME_PICKER_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    mindatetime TIMESTAMPTZ NOT NULL,
    maxdatetime TIMESTAMPTZ NOT NULL
  );

ALTER TABLE
  DATETIME_PICKER_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  NUMBER_PICKER_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    minnumber INT NOT NULL,
    maxnumber INT NOT NULL
  );

ALTER TABLE
  NUMBER_PICKER_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DROPDOWN_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    minanswers INT NOT NULL,
    maxanswers INT NOT NULL,
    userinput BOOLEAN NOT NULL,
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid)
  );

ALTER TABLE
  DROPDOWN_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DROPDOWN_QUESTION_OPTION_TABLE (
    optionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL,
    optiontext VARCHAR(255) NOT NULL,
    FOREIGN KEY (questionid) REFERENCES DROPDOWN_QUESTION_TABLE (questionid)
  );

ALTER TABLE
  DROPDOWN_QUESTION_OPTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  PDF_UPLOAD_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxfilesizeinmb DECIMAL NOT NULL
  );

ALTER TABLE
  PDF_UPLOAD_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  IMAGE_UPLOAD_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxfilesizeinmb DECIMAL NOT NULL
  );

ALTER TABLE
  IMAGE_UPLOAD_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  SHORT_TEXT_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    answertext VARCHAR(255) NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  SHORT_TEXT_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  LONG_TEXT_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    answertext TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  LONG_TEXT_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  MULTIPLE_CHOICE_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    selectedchoice TEXT NOT NULL, -- This will store a JSON array
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  MULTIPLE_CHOICE_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  VIDEO_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    videoname TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  VIDEO_UPLOAD_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  IMAGE_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    imagename TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  IMAGE_UPLOAD_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  PDF_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pdfname TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  PDF_UPLOAD_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DATE_PICKER_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pickeddate DATE NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  DATE_PICKER_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DATETIME_PICKER_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pickeddatetime TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  DATETIME_PICKER_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  NUMBER_PICKER_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pickednumber INT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  NUMBER_PICKER_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DROPDOWN_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    selectedoptions TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  DROPDOWN_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;



-- Roles Management
CREATE TABLE USER_ROLES_TABLE (
    userroleid SERIAL PRIMARY KEY,
    userrolename VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO USER_ROLES_TABLE (userrolename) VALUES ('applicant'), ('reviewer'), ('admin');

ALTER TABLE
  USER_ROLES_TABLE ENABLE ROW LEVEL SECURITY;

create table PUBLIC.USER_PROFILES_TABLE (
  userid uuid not null references auth.users on delete cascade,
  userrole INT REFERENCES user_roles_table(userroleid),
  isactive BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (userid)
);

alter table PUBLIC.USER_PROFILES_TABLE enable row level security;

-- RLS SELECT POLICIES
CREATE POLICY select_policy ON PHASE_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON SHORT_TEXT_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON LONG_TEXT_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON MULTIPLE_CHOICE_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON VIDEO_UPLOAD_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON DATE_PICKER_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON DATETIME_PICKER_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON NUMBER_PICKER_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON DROPDOWN_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON DROPDOWN_QUESTION_OPTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON PDF_UPLOAD_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON IMAGE_UPLOAD_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON USER_ROLES_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_profile ON public.user_profiles_table 
  FOR SELECT USING (userid = auth.uid());

CREATE POLICY insert_profile ON user_profiles_table FOR INSERT
  WITH CHECK (userid = auth.uid());

CREATE POLICY update_profile ON user_profiles_table FOR UPDATE
  WITH CHECK (userid = auth.uid());

CREATE POLICY delete_profile ON public.user_profiles_table 
  FOR DELETE USING (userid = auth.uid());

CREATE POLICY select_application ON application_table FOR SELECT
  USING (userid = auth.uid());

CREATE POLICY insert_application ON application_table FOR INSERT
  WITH CHECK (userid = auth.uid());

CREATE POLICY update_application ON application_table FOR UPDATE
  WITH CHECK (userid = auth.uid());

CREATE POLICY delete_application ON application_table FOR DELETE
  USING (userid = auth.uid());

CREATE POLICY insert_answer ON public.answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.application_table
    WHERE application_table.applicationid = answer_table.applicationid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_answer ON public.answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.application_table
    WHERE application_table.applicationid = answer_table.applicationid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_answer ON public.answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.application_table
    WHERE application_table.applicationid = answer_table.applicationid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_answer ON public.answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.application_table
    WHERE application_table.applicationid = answer_table.applicationid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY insert_short_text_answer ON short_text_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = short_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_short_text_answer ON short_text_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = short_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_short_text_answer ON short_text_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = short_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_short_text_answer ON short_text_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = short_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY insert_long_text_answer ON long_text_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = long_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY select_long_text_answer ON long_text_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = long_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_long_text_answer ON long_text_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = long_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_long_text_answer ON long_text_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = long_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY insert_date_picker_answer ON date_picker_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = date_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_date_picker_answer ON date_picker_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = date_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_date_picker_answer ON date_picker_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = date_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_date_picker_answer ON date_picker_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = date_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_datetime_picker_answer ON datetime_picker_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = datetime_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_datetime_picker_answer ON datetime_picker_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = datetime_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_datetime_picker_answer ON datetime_picker_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = datetime_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_datetime_picker_answer ON datetime_picker_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = datetime_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_number_picker_answer ON number_picker_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = number_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_number_picker_answer ON number_picker_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = number_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_number_picker_answer ON number_picker_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = number_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_number_picker_answer ON number_picker_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = number_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_multiple_choice_answer ON multiple_choice_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = multiple_choice_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_multiple_choice_answer ON multiple_choice_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = multiple_choice_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_multiple_choice_answer ON multiple_choice_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = multiple_choice_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_multiple_choice_answer ON multiple_choice_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = multiple_choice_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_dropdown_answer ON dropdown_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = dropdown_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_dropdown_answer ON dropdown_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = dropdown_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_dropdown_answer ON dropdown_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = dropdown_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_dropdown_answer ON dropdown_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = dropdown_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY insert_pdf_upload_answer ON pdf_upload_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = pdf_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_pdf_upload_answer ON pdf_upload_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = pdf_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_pdf_upload_answer ON pdf_upload_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = pdf_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_pdf_upload_answer ON pdf_upload_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = pdf_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_video_upload_answer ON video_upload_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = video_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_video_upload_answer ON video_upload_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = video_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_video_upload_answer ON video_upload_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = video_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_video_upload_answer ON video_upload_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = video_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_image_upload_answer ON image_upload_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = image_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_image_upload_answer ON image_upload_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = image_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_image_upload_answer ON image_upload_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = image_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_image_upload_answer ON image_upload_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = image_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


