import { IRecordSet } from "mssql"
import { getConnection } from "../database/sqlserver/connection"
import { ListaWhatsAppResponse } from "../interfaces/lista-whatsapp.response"
import { CronService } from "./cron/cron-service"
import { sleep } from "./utils/sleep"

import { getWhatsappMessages, sendWhatsappMessages, updateMessages } from "../controllers/whatsappMessages.controller"

export class Server {
    
    static async start(){
        console.log('Server started...')
      
        /* const res = await getWhatsappMessages()
        console.log(res) */
        

        const job = CronService.createJob(
            '31 12 * * *',
            async() => {
                console.log('Se estan comenzando a mandar mensajes...')
                await sendWhatsappMessages()
                console.log('Se terminaron los mensajes...')
            },

        )

       
    }


}