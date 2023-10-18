from dateutil.parser import isoparse
from dateutil.parser._parser import ParserError

def dt_is_iso8601(date_string):
    try:
        # Try to parse the string as an ISO 8601 date/datetime
        # This will raise a ValueError if the string is not in the correct format
        isoparse(date_string)
        return True
    except (ValueError, ParserError):
        return False
