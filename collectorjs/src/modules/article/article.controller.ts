import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

@Controller('articles')
export class ArticleController {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  @Get()
  async getLatestArticles(@Query('topic') topic: string) {
    return this.articleModel
      .find({ topic })
      .sort({ publishedAt: -1 })
      .limit(10)
      .exec();
  }
}