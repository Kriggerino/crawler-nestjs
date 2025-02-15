// modules/article/article.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { ArticleController } from './article.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema }
    ])
  ],
  controllers: [ArticleController],
  exports: [MongooseModule]
})
export class ArticleModule {}