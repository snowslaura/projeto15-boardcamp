import express from "express";

import { getCathegories } from "../controllers/cathegoriesController.js";
import { postCathegories } from "../controllers/cathegoriesController.js";


const cathegoriesRouter = express.Router()

cathegoriesRouter.get('/categories', getCathegories)
cathegoriesRouter.post('/categories', postCathegories)

export default cathegoriesRouter;