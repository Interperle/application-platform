CREATE OR REPLACE FUNCTION FETCH_CHECKBOX_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, checked bool) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.checked
    FROM CHECKBOX_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_CONDITIONAL_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, selectedchoice text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedchoice
    FROM CONDITIONAL_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_DATETIME_PICKER_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, pickeddatetime timestamptz) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickeddatetime
    FROM DATETIME_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_DATE_PICKER_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, pickeddate date) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickeddate
    FROM DATE_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_DROPDOWN_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, selectedoptions text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedoptions
    FROM DROPDOWN_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_IMAGE_UPLOAD_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, imagename text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.imagename
    FROM IMAGE_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_LONG_TEXT_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, answertext text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.answertext
    FROM LONG_TEXT_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_MULTIPLE_CHOICE_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, selectedchoice text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedchoice
    FROM MULTIPLE_CHOICE_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_NUMBER_PICKER_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, pickednumber int4) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickednumber
    FROM NUMBER_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_PDF_UPLOAD_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, pdfname text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pdfname
    FROM PDF_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_SHORT_TEXT_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, answertext text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.answertext
    FROM SHORT_TEXT_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION FETCH_VIDEO_UPLOAD_ANSWER_TABLE(question_id uuid, user_id uuid)
RETURNS TABLE(answerid uuid, videoname text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.videoname
    FROM VIDEO_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$$ LANGUAGE plpgsql STABLE;