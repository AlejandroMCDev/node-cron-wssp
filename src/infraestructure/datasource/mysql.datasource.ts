import { pool } from "../../data/mysql/connection";
import { CronWhatsAppDatasource } from "../../domain/datasource/cron-whatsapp.datasource";
import { WhatsAppMessage } from "../../domain/entities/cron-whatsapp.entity";
import { whatsappApi } from "../../presentation/axios/whatsAppApi";
import { sleep } from "../../presentation/utils/sleep";

export class MysqlDatasource implements CronWhatsAppDatasource {
  async getNumbers(): Promise<WhatsAppMessage[]> {
    try {
      const res = await pool.query(
        "select * from msjwhatsapptabla m  where fechaEnvio is null"
      );
      const messages = res[0] as WhatsAppMessage[];

      return messages;
    } catch (error) {
      console.log("Algo salio mal");
      return [];
    }
  }
  async sendMessages(): Promise<void> {
    let counter = 1;

    try {
      const messages = await this.getNumbers();

      if (!messages || messages.length === 0)
        throw "No hay mensajes para enviar.";

      for (const item of messages) {
        if (counter % 10 === 0) {
          await sleep(180000);
        }

        const { data } = await whatsappApi.post("/messages", {
          number: `51${item.celular}`,
          message: `Estimado(a) Colegiado(a) *${item.NombreApellido}*.\n\nLe recordamos que, a la fecha de hoy, no se encuentra habilitado debido al retraso en el pago de sus cuotas colegiales. Es importante regularizar su situación para poder participar en las elecciones generales que se llevarán a cabo en noviembre.\n\nSi ya se encuentra al día con sus pagos, por favor ignore este mensaje. En caso contrario, le pedimos que se comunique con la Tesorería al número https://wa.me/949521888 para resolver cualquier duda o realizar el pago correspondiente.\n\nAgradecemos su atención y compromiso.\n\nAtentamente,\nColegio Químico Farmaceutico de la Libertad.
`,
        });

        const { ok } = data;

        if (!ok) {
          await this.updateMessageState(item.id, true);
        } else {
          await this.updateMessageState(item.id);
        }

        counter++;
        await sleep(60000);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateMessageState(
    id: number,
    isError: boolean = false
  ): Promise<void> {
    try {
      const query = `UPDATE msjwhatsapptabla SET fechaEnvio = ? WHERE id = ?`;

      if (isError) {
        const query = `UPDATE msjwhatsapptabla SET fechaEnvio = ?, observacion = ? WHERE id = ?`;

        const params = [
          new Date(),
          "El numero no existe o hubo un error en el sistema",
          id,
        ];

        await pool.query(query, params);
        return;
      }

      const params = [new Date(), id];
      await pool.query(query, params);
    } catch (error) {
      console.log("Algo salio mal al querer actualizar el numero", id);
    }
  }
}
