import sql from "mssql";

const dbSettings = {
  server: "cenginebd.database.windows.net",
  user: "cengine",
  password: "iM@9CnQ80d2T",
  database: "uniclinic_mssql",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.log(error);
  }
};
