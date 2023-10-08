import os
import logging
import requests

class Logger:
    
    def __init__(self, module: str):
        self.api_url = f"https://api.logflare.app/api/logs?source={os.environ['LOGFLARE_BACKEND_SOURCE_TOKEN']}"
        self.HEADER = {
            'Content-Type': 'application/json',
            'x-api-key': os.environ['LOGFLARE_BACKEND_API_TOKEN']
        }
        self.logger = logging.getLogger('ApiLogger')
        self.module = module

    def debug(self, message):
        self.logger.debug(message, "debug")

    def info(self, message):
        self.__send_log_to_log_flare(message, "info")
    
    def warning(self, message):
        self.__send_log_to_log_flare(message, "warning")

    def error(self, message):
        self.__send_log_to_log_flare(message, "error")

    def fatal(self, message):
        self.__send_log_to_log_flare(message, "fatal")

    def __send_log_to_log_flare(self, message, level):
        payload = {
            "event_message": message,
            "metadata": {
                "level": level,
                "module": self.module,
            }
        }
        try:
            
            response = requests.post(self.api_url, headers=self.HEADER, json=payload)
            if response.status_code != 200:
                self.logger.error("Failed to send log to API. Status code:", response.status_code)
        except requests.RequestException as e:
            self.logger.error("Failed to send log to API. Error:", str(e))
    

def run():
    log = Logger("TEST")
    log.info("TEST MESSAGE")