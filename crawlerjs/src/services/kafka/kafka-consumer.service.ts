import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kafka } from 'kafkajs';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { DantriCrawlerService } from '../crawlers/dantri-crawler.service';
import { VnExpressCrawlerService } from '../crawlers/vnexpress-crawler.service';
import { kafkaConfig, TOPICS } from '../../config/kafka.config';
import axios from 'axios';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private readonly kafka: Kafka;
  private readonly consumer;

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private readonly dantriCrawler: DantriCrawlerService,
    private readonly vnexpressCrawler: VnExpressCrawlerService,
  ) {
    this.kafka = new Kafka(kafkaConfig);
    this.consumer = this.kafka.consumer({ groupId: kafkaConfig.groupId });
  }

  async onModuleInit() {
    await this.startConsuming();
  }

  private async startConsuming() {
    try {
      await this.consumer.connect();
      this.logger.log('Kafka consumer connected');

      await this.consumer.subscribe({
        topics: [TOPICS.DANTRI_ARTICLES, TOPICS.VNEXPRESS_ARTICLES],
        fromBeginning: true,
      });

      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          await this.processMessage(message);
        },
      });

      this.logger.log('Kafka consumer is running');
    } catch (error) {
      this.logger.error(
        `Failed to start Kafka consumer: ${error.message}`,
        error.stack,
      );
      setTimeout(() => this.startConsuming(), 5000);
    }
  }

  private async processMessage(message: any) {
    try {
      const messageData = JSON.parse(message.value.toString());
      this.logger.log(`Processing ${messageData.source} article: ${messageData.url}`);

      const existingArticle = await this.articleModel.findOne({
        url: messageData.url,
      });
      
      if (existingArticle) {
        this.logger.log(`Article already exists: ${messageData.url}`);
        return;
      }

      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      };

      const response = await axios.get(messageData.url, { headers });

      let articleContent;
      if (messageData.source === 'dantri') {
        articleContent = await this.dantriCrawler.extractContent(
          messageData.url,
          response.data,
        );
      } else if (messageData.source === 'vnexpress') {
        articleContent = await this.vnexpressCrawler.extractContent(
          messageData.url,
          response.data,
        );
      }

      const article = new this.articleModel({
        title: articleContent.title,
        url: messageData.url,
        content: articleContent.content,
        topic: messageData.topic,
        source: messageData.source,
        createdAt: new Date(),
      });

      await article.save();
      this.logger.log(`Saved ${messageData.source} article: ${messageData.url}`);
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`, error.stack);
    }
  }
}