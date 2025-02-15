// src/schemas/article.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: [String], required: true })
  content: string[];

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  createdAt: Date;
}

export type ArticleDocument = Article & Document;
export const ArticleSchema = SchemaFactory.createForClass(Article);