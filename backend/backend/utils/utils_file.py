import yaml


def read_yaml_file(filename):
    """
    Read the content of a YAML file and return the data.

    :param filename: str, the name (and path) of the YAML file.
    :return: dict, the data from the YAML file.
    """
    with open(filename, 'r') as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)
            return None