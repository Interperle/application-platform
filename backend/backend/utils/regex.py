import re


def phone_number_regex_check(string: str) -> bool:
    '''
    Simple phone number regex check.
    See: https://uibakery.io/regex-library/phone-number-python
    '''
    string = string.replace(' ', '')
    regex_world = '^\\+?[1-9][0-9]{7,14}$'
    regex_german = '^0[0-9]{3}[0-9]{7}$'
    return bool(re.match(regex_world, string)) or bool(re.match(regex_german, string))


def email_regex_check(string: str) -> bool:
    '''
    Simple email regex check.
    See: https://uibakery.io/regex-library/email-regex-python
    '''
    string = string.strip()
    string = string.lower()
    regex = r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@" + \
                                            r"(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
    return bool(re.match(regex, string))


def natural_number_check(string: str) -> bool:
    '''
    Simple check if string contains a natural number (>=0). Leading '+' is allowed.
    NOTE: if superscripts like ² and fraction value like ½ are allowed, use python's isdigit() instead.
    '''
    regex = "^\\d+$"
    string = string[1:] if string.startswith('+') else string
    return bool(re.match(regex, string))


def rational_number_check(string: str) -> bool:
    '''
    Simple check if string contains a rational number. Leading '+' or '-' are allowed.
    NOTE: if superscripts like ² and fraction value like ½ are allowed, use python's isnumeric() instead.
    '''
    regex = "^(?:-(?:[1-9](?:\\d{0,2}(?:,\\d{3})+|\\d*))|(?:0|(?:[1-9](?:\\d{0,2}(?:,\\d{3})+|\\d*))))(?:.\\d+|)$"
    string = string[1:] if string.startswith(('+', '-')) else string
    return bool(re.match(regex, string))