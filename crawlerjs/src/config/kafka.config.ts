// src/config/kafka.config.ts
export const kafkaConfig = {
    clientId: 'news-crawler',
    brokers: ['localhost:9092'],
    groupId: 'crawler-group',
  };
  
  export const TOPICS = {
    DANTRI_ARTICLES: 'dantri-articles',
    VNEXPRESS_ARTICLES: 'vnexpress-articles',
  };