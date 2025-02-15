import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from '../../modules/kafka/kafka.service';
import { TOPICS } from '../../config/kafka.config';
import * as cheerio from 'cheerio';
import axios from 'axios';

@Injectable()
export class VnExpressCollectorService {
  private readonly logger = new Logger(VnExpressCollectorService.name);
  private readonly baseUrl = 'https://vnexpress.net';
  private readonly topics = [
    { name: 'kinh-doanh', path: '/kinh-doanh' },
    { name: 'the-gioi', path: '/the-gioi' },
    //Add more
  ];

  constructor(private readonly kafkaService: KafkaService) {}

  async startCollecting() {
    this.logger.log('Starting VnExpress link collection...');
    
    for (const topic of this.topics) {
      await this.collectLinks(topic);
    }
  }

  private async collectLinks(topic: { name: string; path: string }) {
    try {
      const url = `${this.baseUrl}${topic.path}`;
      this.logger.log(`Collecting links from ${url}`);
      
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      for (const element of $('.title-news').toArray()) {
        const articleElement = $(element).find('a');
        const title = articleElement.text().trim();
        const articleUrl = articleElement.attr('href');

        if (title && articleUrl) {
          const fullUrl = articleUrl.startsWith('http') ? articleUrl : `${this.baseUrl}${articleUrl}`;
          
          const message = {
            url: fullUrl,
            title,
            source: 'vnexpress',
            topic: topic.name,
            collectedAt: new Date().toISOString()
          };

          try {
            await this.kafkaService.send(TOPICS.VNEXPRESS_ARTICLES, message);
            console.log(`Successfully sent to Kafka: ${fullUrl}`);
          } catch (error) {
            this.logger.error(`Failed to send message for: ${fullUrl}`);
          }
        }
      }

      this.logger.log(`Completed collecting links for ${topic.name}`);
      
    } catch (error) {
      this.logger.error(`Error collecting links from ${topic.name}: ${error.message}`);
    }
  }
}