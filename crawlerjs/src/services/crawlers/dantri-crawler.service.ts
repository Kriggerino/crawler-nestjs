import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class DantriCrawlerService {
  private readonly logger = new Logger(DantriCrawlerService.name);

  async extractContent(
    url: string,
    html: string,
  ): Promise<{ title: string; content: string[] }> {
    try {
      const $ = cheerio.load(html);
      const title = $('h1.title-page').text().trim();
      const contentParagraphs: string[] = [];

      $('.singular-content p').each((_, element) => {
        const text = $(element).text().trim();
        if (text) {
          contentParagraphs.push(text);
        }
      });

      return { title, content: contentParagraphs };
    } catch (error) {
      this.logger.error(
        `Error extracting Dantri content from ${url}: ${error.message}`,
      );
      throw error;
    }
  }
}
