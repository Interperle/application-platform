import re


def phone_number_regex_check(string: str) -> bool:
    '''
    Simple phone number regex check.
    See: https://uibakery.io/regex-library/phone-number-python
    '''
    string = string.replace(' ', '')
    regex_ = r'^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$'
    return bool(re.match(regex_, string))


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
    Simple check if string contains a natural number (>=0). Leading '+' is not allowed.
    NOTE: if superscripts like ² and fraction value like ½ are allowed, use python's isdigit() instead.
    '''
    regex = r"^[1-9]\d+$"
    return bool(re.match(regex, string))


def rational_number_check(string: str) -> bool:
    '''
    Simple check if string contains a rational number. Leading '+' is not allowed.
    NOTE: if superscripts like ² and fraction value like ½ are allowed, use python's isnumeric() instead.
    '''
    regex = r"^(-?)(0|[1-9]\d*)([.](\d*)[1-9])?$"
    return bool(re.match(regex, string))