import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { DantriCrawlerService } from './services/crawlers/dantri-crawler.service';
import { VnExpressCrawlerService } from './services/crawlers/vnexpress-crawler.service';
import { KafkaConsumerService } from './services/kafka/kafka-consumer.service';
import { AppController } from './app.controller';
import { mongoConfig } from './config/mongodb.config';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig.uri),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [AppController],
  providers: [
    DantriCrawlerService,
    VnExpressCrawlerService,
    KafkaConsumerService,
  ],
})
export class AppModule {}