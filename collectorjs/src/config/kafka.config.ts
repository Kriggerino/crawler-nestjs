// news-collector/src/config/kafka.config.ts
export const kafkaConfig = {
  clientId: 'news-collector',
  brokers: ['localhost:9092'],
  groupId: 'collector-group',
};

export const TOPICS = {
  DANTRI_ARTICLES: 'dantri-articles',
  VNEXPRESS_ARTICLES: 'vnexpress-articles',
};
