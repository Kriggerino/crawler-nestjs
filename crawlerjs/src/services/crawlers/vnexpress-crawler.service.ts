import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class VnExpressCrawlerService {
  private readonly logger = new Logger(VnExpressCrawlerService.name);

  async extractContent(
    url: string,
    html: string,
  ): Promise<{ title: string; content: string[] }> {
    try {
      const $ = cheerio.load(html);
      const title = $('h1.title-detail').text().trim();
      const contentParagraphs: string[] = [];

      const description = $('p.description').text().trim();
      if (description) {
        contentParagraphs.push(description);
      }

      $('p.Normal').each((_, element) => {
        const text = $(element).text().trim();
        if (text) {
          contentParagraphs.push(text);
        }
      });

      return { title, content: contentParagraphs };
    } catch (error) {
      this.logger.error(
        `Error extracting VnExpress content from ${url}: ${error.message}`,
      );
      throw error;
    }
  }
}
