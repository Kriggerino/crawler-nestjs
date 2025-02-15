// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { DantriCrawlerService } from './services/crawlers/dantri-crawler.service';
import { VnExpressCrawlerService } from './services/crawlers/vnexpress-crawler.service';
import { ArticleConsumerService } from './services/article-consumer.service';
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
    ArticleConsumerService,
  ],
})
export class AppModule {}