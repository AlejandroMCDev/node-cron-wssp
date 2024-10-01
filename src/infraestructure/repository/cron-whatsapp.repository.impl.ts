
import { CronWhatsAppDatasource } from "../../domain/datasource/cron-whatsapp.datasource";
import { WhatsAppMessage } from "../../domain/entities/cron-whatsapp.entity";
import { CronWhatsAppRepository } from "../../domain/repository/cron-whatsapp.repository";

export class CronWhatsAppRepositoryImpl implements CronWhatsAppRepository {

    constructor(
        private readonly whatsAppDataSource: CronWhatsAppDatasource
    ){}
    async updateMessageState(id: number): Promise<void> {
        this.whatsAppDataSource.updateMessageState(id)
    }
    async getNumbers(): Promise<WhatsAppMessage[]> {
        return this.whatsAppDataSource.getNumbers()
    }
    async sendMessages(): Promise<void> {
        this.whatsAppDataSource.sendMessages()
    }



}