import mongoose from "mongoose";

const bookedServiceSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  serviceDescription: {
    type: String,
    required: true,
  },
  serviceImageUrl: {
    type: String,
    required: true,
  },
  serviceProviderImageUrl: {
    type: String,
    required: true,
  },
  serviceProviderEmail: {
    type: String,
    required: true,
  },
  serviceProviderName: {
    type: String,
    required: true,
  },
  currentUserEmail: {
    type: String,
    required: true,
  },
  currentUserName: {
    type: String,
    required: true,
  },
  serviceTakingDate: {
    type: String,
  },
  specialInstructions: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  serviceStatus: {
    type: String,
    default: "Pending",
  },
});

const BookedService = mongoose.model("BookedService", bookedServiceSchema);

export default BookedService;
