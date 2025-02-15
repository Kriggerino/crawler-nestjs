import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from '../../modules/kafka/kafka.service';
import { TOPICS } from '../../config/kafka.config';
import * as cheerio from 'cheerio';
import axios from 'axios';

@Injectable()
export class DantriCollectorService {
 private readonly logger = new Logger(DantriCollectorService.name);
 private readonly baseUrl = 'https://dantri.com.vn';
 private readonly topics = [
   { name: 'xa-hoi', path: '/xa-hoi' },
   { name: 'the-gioi', path: '/the-gioi' }, 
 ];

 private readonly titleSelectors = [
   'a.dt-text-black-mine',
   'a.title',
   'a.article-link',
   'h1.e-magazine__title', 
   'div.e-magazine__title',
   '.e-magazine__title',
   'span.title a',
   'a'
 ];

 constructor(private readonly kafkaService: KafkaService) {}

 async startCollecting() {
   this.logger.log('Starting Dantri link collection...');
   
   for (const topic of this.topics) {
     await this.collectLinks(topic);
   }
 }

 private async collectLinks(topic: { name: string; path: string }) {
   try {
     const url = `${this.baseUrl}${topic.path}.htm`;
     this.logger.log(`Collecting links from ${url}`);
     
     const response = await axios.get(url);
     const $ = cheerio.load(response.data);
     
     for (const element of $('h3.article-title').toArray()) {
       let title = '';
       let articleUrl: string | undefined;

       for (const selector of this.titleSelectors) {
         const articleElement = $(element).find(selector);
         const tempTitle = articleElement.text().trim();
         const tempUrl = articleElement.attr('href');
         
         if (tempTitle && tempUrl) {
           title = tempTitle;
           articleUrl = tempUrl;
           break;
         }
       }

       if (!title) {
         title = $(element).text().trim();
       }

       if (title && articleUrl) {
         const fullUrl = articleUrl.startsWith('http') ? articleUrl : `${this.baseUrl}${articleUrl}`;
         
         const message = {
           url: fullUrl,
           title,
           source: 'dantri',
           topic: topic.name,
           collectedAt: new Date().toISOString()
         };

         try {
           await this.kafkaService.send(TOPICS.DANTRI_ARTICLES, message);
           this.logger.log(`Successfully sent to Kafka: ${fullUrl}`);
         } catch (error) {
           this.logger.error(`Failed to send message for: ${fullUrl}`, error);
         }
       }
     }

     this.logger.log(`Completed collecting links for ${topic.name}`);
     
   } catch (error) {
     this.logger.error(`Error collecting links from ${topic.name}: ${error.message}`);
   }
 }
}