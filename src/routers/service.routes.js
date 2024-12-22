import express from 'express';
import { getAllServices, getServiceById, getUserAddedServices, getUserBookedServices, createService, bookService } from '../controllers/service.controller';


const router = express.Router();

router.get("/get-all-services", getAllServices);
router.get("/get-service/:serviceId", getServiceById);
router.post("/create-service", createService);
router.get('/get-added-services/:userId', getUserAddedServices);
router.patch('/update-service', updateService);
router.delete('/delete-service', deleteService);
router.post("/book-service", bookService);
router.get('/get-booked-services/:userId', getUserBookedServices);

export default router;
