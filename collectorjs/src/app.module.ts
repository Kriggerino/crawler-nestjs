// news-collector/src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaModule } from './modules/kafka/kafka.module';
import { DantriCollectorService } from './services/collectors/dantri-collector.service';
import { VnExpressCollectorService } from './services/collectors/vnexpress-collector.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    KafkaModule,
  ],
  providers: [
    DantriCollectorService,
    VnExpressCollectorService
  ],
})
export class AppModule {
  constructor(
    private readonly dantriCollectorService: DantriCollectorService,
    private readonly vnexpressCollectorService: VnExpressCollectorService
  ) {
    this.startCollecting();
  }

  private async startCollecting() {
    await Promise.all([
      this.dantriCollectorService.startCollecting(),
      this.vnexpressCollectorService.startCollecting()
    ]);
  }
}