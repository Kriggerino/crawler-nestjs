export const kafkaConfig = {
  clientId: 'news-collector',
  brokers: ['localhost:29092'],
  groupId: 'collector-group',
};

export const TOPICS = {
  DANTRI_ARTICLES: 'dantri-articles',
  VNEXPRESS_ARTICLES: 'vnexpress-articles',
};