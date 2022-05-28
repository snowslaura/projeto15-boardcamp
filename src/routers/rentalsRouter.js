import express from "express"

import { getRentals, postRentals, finishRental, deleteRental} from "../controllers/rentalController.js";

const rentalRouter = express.Router();

rentalRouter.get('/rentals', getRentals)
rentalRouter.post('/rentals', postRentals)
rentalRouter.post('/rentals/:id/return', finishRental)
rentalRouter.delete('/rentals/:id', deleteRental)

export default rentalRouter;