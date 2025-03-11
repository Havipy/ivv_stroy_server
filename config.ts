import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";

class ConfigService {
  private readonly config!: DotenvParseOutput;
  constructor() {
    const result: DotenvConfigOutput = config();
    if (result.error) {
      console.error("[ConfigService] Cannot read .env file");
    } else {
      console.log("[ConfigService] Configuration from .env loaded");
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}

export const Config = new ConfigService();
