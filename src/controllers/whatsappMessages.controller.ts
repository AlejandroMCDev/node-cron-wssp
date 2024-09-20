import { IRecordSet } from "mssql";
import { getConnection } from "../database/sqlserver/connection";
import { ListaWhatsAppResponse } from "../interfaces/lista-whatsapp.response";
import { sleep } from "../presentation/utils/sleep";
import axios from "axios";

export const getWhatsappMessages = async () => {
  try {
    const pool = await getConnection();
    const res = await pool
      ?.request()
      .query<ListaWhatsAppResponse>("EXEC ListaEnvioWhatsapp");
    const messagesToSend = res?.recordset as IRecordSet<ListaWhatsAppResponse>;
    const messagesToSendMapped = messagesToSend.map((item) => ({
      ...item,
      movil: `51${item.movil}`,
      mensaje: item.mensaje.replace("[nombre]", item.nombres),
    }));

    return messagesToSendMapped;
  } catch (error) {
    console.log(error);
  }
};

export const updateMessages = async (id: number) => {
  try {
    const pool = await getConnection();
    await pool?.request().query(`EXEC ActualizaListawhathaspp ${id}`);
  } catch (error) {
    console.log(error)
  }
};

export const sendWhatsappMessages = async () => {
  try {
    const messages = await getWhatsappMessages();
    if (!messages) throw "Messages doesnt exist.";
    if (messages.length === 0) return;

    for (const item of messages) {
      await axios.post("https://apixwhatsapp.azurewebsites.net/v1/messages", {
        number: item.movil,
        message: item.mensaje,
        media: item.xurl
      });
      await updateMessages(item.id) 
      await sleep(60000);
    }
  } catch (error) {
    console.log(error);
  }
};
