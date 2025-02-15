**System Overview**
The system consists of two main applications:

News Collector: Collects article links from news websites and sends them to Kafka
News Crawler: Consumes links from Kafka, extracts article content, and stores in MongoDB

**Prerequisites**

Docker and Docker Compose
Node.js (v14 or later)
npm (v6 or later)

**Database Index**
```
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
```

Containing title, url, content, topic, source and time pulled from the site 

ArticleSchema.index({ url: 1 }, { unique: true }); // Optimize for single url search and preventing duplicates
ArticleSchema.index({ topic: 1, createdAt: -1 }); // Optimized createdAt column (topic optional) for latest 10
ArticleSchema.index({ topic: 1, source: 1, createdAt: -1 }); // Optimized for filtered topic AND source

**Setup**

1. Clone the repo
2. Create a docker container through the compose.yml file

```
docker-compose up
```

3. Install dependencies on both applications

```
cd collectorjs
npm install
```

```
cd crawlerjs
npm install
```

4. Start both application with npm

```
npm run start:dev
```
5. After the collector collected the urls visit the endpoints to see the result

```
GET http://localhost:3001/articles?topic=<topic>&source=<source>
```

Get latest 10 articles from a topic
Optional source filter (dantri/vnexpress)

```
GET http://localhost:3001/articles/detail?url=<article-url>
```

**Multi-instance**

Multiple crawler / collectors can be simultaneously ran by using different ports in multiple terminals or PM2 without overloading one due to round-robin queue