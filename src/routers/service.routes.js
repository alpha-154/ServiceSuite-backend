import express from "express";
import {
  fetchServicesByQuery,
  getAllServices,
  getAllSixServices,
  getServiceById,
  createService,
  getUserAddedServices,
  updateService,
  deleteService,
  bookService,
  getUserBookedServices,
  getUserToDoServices,
  updateToDoServiceStatus
} from "../controllers/service.controller.js";

const router = express.Router();

router.post("/search-services", fetchServicesByQuery);
router.get("/get-six-services", getAllSixServices);
router.get("/get-all-services", getAllServices);
router.get("/get-service/:serviceId", getServiceById);
router.post("/create-service", createService);
router.get("/get-added-services/:uid", getUserAddedServices);
router.patch("/update-service", updateService);
router.delete("/delete-service", deleteService);
router.post("/book-service", bookService);
router.get("/get-booked-services/:uid", getUserBookedServices);
router.get("/get-todo-services/:uid", getUserToDoServices);
router.patch("/update-todo-service", updateToDoServiceStatus);

export default router;
