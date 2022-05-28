import express, {json} from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();

import cathegoriesRouter from "../routers/cathegoriesRouter.js";
import gameRouter from "../routers/gamesRouters.js";
import customerRouter from "../routers/customerRouter.js"

const app = express();
app.use(cors());
app.use(json());

app.use(cathegoriesRouter);
app.use(gameRouter);
app.use(customerRouter);

const port = process.env.PORT || 4000;

app.listen(port , ()=>{
    console.log(`Server running on port http://localhost:${port}`)
})

