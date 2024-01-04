import { getURL } from "@/utils/helpers";
import pino from "pino";
import { createPinoBrowserSend, createWriteStream } from "pino-logflare";

interface LogDetails {
  module: string;
  msg: string;
  userId?: string;
}

class Logger {
  module: string;
  logger: pino.Logger;

  constructor(module: string) {
    const apiKey = process.env.NEXT_PUBLIC_LOGFLARE_API_TOKEN;
    const sourceToken = process.env.NEXT_PUBLIC_LOGFLARE_CLIENT_TOKEN;
    if (!apiKey || !sourceToken) {
      throw new Error("Logflare API key and source token must be configured!");
    }
    const stream = createWriteStream({
      apiKey: apiKey,
      sourceToken: sourceToken,
      transforms: {
        numbersToFloats: true,
      },
    });

    const send = createPinoBrowserSend({
      apiKey: apiKey,
      sourceToken: sourceToken,
      transforms: {
        numbersToFloats: true,
      },
    });

    this.module = module;
    this.logger = pino(
      {
        browser: {
          transmit: {
            level: "info",
            send: send,
          },
        },
        level: "info",
      },
      stream,
    );
  }

  private getDetails(msg: string, userId?: string) {
    const details: LogDetails = {
      module: this.module,
      msg: msg,
    };
    if (userId) details.userId = userId;
    return details;
  }

  debug(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    if (getURL() == "http://localhost:3000/"){
      console.debug(details);
    }
  }

  info(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    if (getURL() == "http://localhost:3000/"){
      console.info(details);
    } else {
      this.logger.info(details);
    }
  }

  warn(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    console.warn(JSON.stringify(details))
    if (getURL() != "http://localhost:3000/"){
      this.logger.warn(details);
    }
  }

  error(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    console.error(JSON.stringify(details))
    if (getURL() != "http://localhost:3000/"){
      this.logger.error(details);
    }
  }

  fatal(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    console.error(JSON.stringify(details))
    if (getURL() != "http://localhost:3000/"){
      this.logger.fatal(details);
    }
  }
}

export default Logger;
