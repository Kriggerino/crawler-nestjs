import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

@Controller()
export class AppController {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  @Get('articles')
  async getLatestArticles(
    @Query('topic') topic: string,
    @Query('source') source?: string,
  ) {
    const query: any = { topic };
    if (source) {
      query.source = source;
    }

    return this.articleModel
      .find(query)
      .select('title url topic source createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }

  @Get('articles/detail')
  async getArticleDetail(@Query('url') url: string) {
    return this.articleModel.findOne({ url }).exec();
  }
}
