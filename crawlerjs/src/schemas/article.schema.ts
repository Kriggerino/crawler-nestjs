
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
ArticleSchema.index({ url: 1 }, { unique: true }); //fast url search (prevening repeats)
ArticleSchema.index({ topic: 1, createdAt: -1 }); // fast latest search
ArticleSchema.index({ topic: 1, source: 1, createdAt: -1 }); //filter by both topic and source
