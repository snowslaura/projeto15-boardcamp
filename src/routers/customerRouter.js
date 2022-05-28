import express from "express"

import { getCustomers, getOnlyCustomer, postCustomers, putCustomers} from "../controllers/customerController.js";

const customerRouter = express.Router();

customerRouter.get('/customers', getCustomers);
customerRouter.get('/customers/:id', getOnlyCustomer);
customerRouter.post('/customers', postCustomers);
customerRouter.put('/customers/:id', putCustomers)

export default customerRouter;