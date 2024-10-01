import { WhatsAppMessage } from "../entities/cron-whatsapp.entity";

export abstract class CronWhatsAppRepository {
  abstract getNumbers(): Promise<WhatsAppMessage[]>;
  abstract sendMessages(): Promise<void>;
  abstract updateMessageState( id: number ): Promise<void>;
}
