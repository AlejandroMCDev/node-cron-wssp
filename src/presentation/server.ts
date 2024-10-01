import { CronService } from "./cron/cron-service";

import { CronWhatsAppRepositoryImpl } from "../infraestructure/repository/cron-whatsapp.repository.impl";
import { MysqlDatasource } from "../infraestructure/datasource/mysql.datasource";

const cronWhatsappRepository = new CronWhatsAppRepositoryImpl(
  new MysqlDatasource()
);

export class Server {
  static async start() {
    console.log("Server started...");

    await cronWhatsappRepository.sendMessages();
  }
}
