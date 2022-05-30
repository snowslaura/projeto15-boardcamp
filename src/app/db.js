import pg from "pg"
import dotenv from "dotenv"
dotenv.config();

const {Pool} = pg;

const databaseConfig = {
    connectionString: process.env.DATA_BASE_URL
};

if(process.env.MODE === "PROD"){
    databaseConfig.ssl = {
        rejectUnauthorized: false
    }
}

const db = new Pool(databaseConfig)

export default db;