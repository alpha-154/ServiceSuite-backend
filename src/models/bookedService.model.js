import mongoose from "mongoose";

const bookedServiceSchema = new mongoose.Schema({ 
 serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
 },
 serviceName: {
    type: String,
    required: true,
  },
  serviceImageUrl: {
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
  currentUsername: {
    type: String,
    required: true,
  },
  serviceTakingDate:{
    type: Date,
    default: Date.now,
  }, 
  specialInstructions: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  serviceStatus:{
    type: String,
    default: "Pending",
  },
});

const BookedService = mongoose.model("BookedService", bookedServiceSchema);

export default BookedService;
