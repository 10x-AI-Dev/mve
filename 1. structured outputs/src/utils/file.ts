import * as fs from 'fs';
import { logger } from './logger.js';

export class FileUtils {
  static ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.verbose(`Created directory: ${dir}`);
    }
  }
}
