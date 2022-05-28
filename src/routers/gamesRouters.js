import express from "express"
import {getGames,postGames} from "../controllers/gamesControllers.js";
 

const gameRouter = express.Router();

gameRouter.get('/games', getGames)
gameRouter.post('/games', postGames)

export default gameRouter;