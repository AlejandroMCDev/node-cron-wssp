import { WhatsAppMessage } from "../entities/cron-whatsapp.entity";

export abstract class CronWhatsAppDatasource {
  abstract getNumbers(): Promise<WhatsAppMessage[]>;
  abstract sendMessages(): Promise<void>;
  abstract updateMessageState( id: number ): Promise<void>;
}
