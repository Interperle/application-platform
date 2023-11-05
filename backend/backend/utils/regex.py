import re

REGEX = {
    'PHONE_NUMBER': r'^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$',
    'URL_SEGMENT': r"^(_|-|[a-z]|[A-Z]|[0-9])+$",
    'EMAIL': r"^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@" + \
                            r"(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$",
    'TEXT': r'^[a-zA-Z0-9_ ]*$',
    'NATURAL_NUMBER':  r'^[1-9]\d+$',
    'RATIONAL_NUMBER': r'^(-?)(0|[1-9]\d*)([.](\d*)[1-9])?$'
}


def phone_number_regex_check(string: str) -> bool:
    '''
    Simple phone number regex check.
    See: https://uibakery.io/regex-library/phone-number-python
    '''
    return bool(re.match(REGEX['PHONE_NUMBER'], string))


def email_regex_check(string: str) -> bool:
    '''
    Simple email regex check.
    See: https://uibakery.io/regex-library/email-regex-python
    '''
    return bool(re.match(REGEX['EMAIL'], string))


def natural_number_check(string: str) -> bool:
    '''
    Simple check if string contains a natural number (>=0). Leading '+' is not allowed.
    NOTE: if superscripts like ² and fraction value like ½ are allowed, use python's isdigit() instead.
    '''
    return bool(re.match(REGEX['NATURAL_NUMBER'], string))


def rational_number_check(string: str) -> bool:
    '''
    Simple check if string contains a rational number. Leading '+' is not allowed.
    NOTE: if superscripts like ² and fraction value like ½ are allowed, use python's isnumeric() instead.
    '''
    return bool(re.match(REGEX['RATIONAL_NUMBER'], string))


def url_phase_segment_check(string: str) -> bool:
    '''
    Simple check if string contains a valid phase segment for the URL.
    '''
    return bool(re.match(REGEX['URL_SEGMENT'], string))
