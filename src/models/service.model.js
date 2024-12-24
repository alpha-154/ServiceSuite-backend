import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  serviceImageUrl: {
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
  serviceArea: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  serviceProviderImageUrl: {
    type: String,
    required: true,
  },
  serviceProviderName: {
    type: String,
    required: true,
  },
  serviceProviderEmail: {
    type: String,
    required: true,
  },
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
