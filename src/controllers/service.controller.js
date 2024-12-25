import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import BookedService from "../models/bookedService.model.js";

//Controller to get all existing services while user searching on the serach bar
export const fetchServicesByQuery = async (req, res) => {
  try {
    const { query } = req.body; // Extract the query from the request body

    // Validate that a query is provided
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    // Search for movies where the title contains the query string (case-insensitive)
    const services = await Service.find({
      serviceName: { $regex: query, $options: "i" }, // "i" for case-insensitive
    });

    // Check if any movies were found
    if (services.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found matching the query." });
    }

    // Respond with the list of movies
    res.status(200).json({ searchedServices: services });
  } catch (error) {
    console.error("Error fetching movies by query:", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllSixServices = async (req, res) => {
  
  try {
    
    const services = await Service.find().limit(6);
   

    if (!services.length) {
      return res.status(404).json({ message: "No services found." });
    }

    return res.status(200).json({ services });
  } catch (error) {
    console.error("Error in getAllServices:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to get all existing services of a user
export const getAllServices = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  try {
    const skip = (page - 1) * limit;
    const services = await Service.find().skip(skip).limit(Number(limit));
    const totalServices = await Service.countDocuments();
    const totalPages = Math.ceil(totalServices / limit);

    if (!services.length) {
      return res.status(404).json({ message: "No services found." });
    }

    return res.status(200).json({ services, totalPages });
  } catch (error) {
    console.error("Error in getAllServices:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


//Controller to get a service with service ID
export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Find the service by ID
    const service = await Service.findById(serviceId);

    // Check if service exists
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Return the service if found
    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error in getServiceById:", error);

    // Handle invalid ObjectId format error
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format",
      });
    }

    // Handle any other server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controller to create a service

export const createService = async (req, res) => {
  try {
    const {
      uid,
      serviceImageUrl,
      serviceName,
      serviceDescription,
      serviceArea,
      price,
      serviceProviderImageUrl,
      serviceProviderName,
      serviceProviderEmail,
    } = req.body;

    // Validate input
    if (
      !uid ||
      !serviceImageUrl ||
      !serviceName ||
      !serviceDescription ||
      !serviceArea ||
      !price ||
      !serviceProviderImageUrl ||
      !serviceProviderName ||
      !serviceProviderEmail
    ) {
      return res.status(400).json({ message: "Data is missing" });
    }

    // Step 1: Finding the user by firebaseUid
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Creating a new service
    const newService = await Service.create({
      serviceImageUrl,
      serviceName,
      serviceDescription,
      serviceArea,
      price,
      serviceProviderImageUrl,
      serviceProviderName,
      serviceProviderEmail,
    });

    // Step 3: Push the new service's ObjectId to the user's addServices array
    user.addServices.push(newService._id); // Correct access to user's addServices
    await user.save(); // Save the updated user document

    return res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Controller to get all added services of a user
export const getUserAddedServices = async (req, res) => {
  try {
    const { uid } = req.params; // Get userId from URL params

    const user = await User.findOne({ firebaseUid: uid }).populate(
      "addServices"
    ); // Populate the addServices array

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the populated addServices array
    return res.status(200).json({
      message: "User added services fetched successfully.",
      addedServices: user.addServices,
      count: user.addServices.length,
    });
  } catch (error) {
    console.error("Error in getUserAddedServices:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format." });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};

//Controller to update an existing added service
export const updateService = async (req, res) => {
  try {
    const {
      uid,
      serviceId,
      serviceImageUrl,
      serviceName,
      serviceDescription,
      serviceArea,
      price,
      serviceProviderImageUrl,
      serviceProviderName,
      serviceProviderEmail,
    } = req.body;

    // Finding the user by userId
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the existing service through serviceName
    const existingService = await Service.findOne({ _id: serviceId });
    if (!existingService) {
      return res.status(404).json({ message: "Service not found!" });
    }

    // Check if the service exists in user's addServices
    if (!user.addServices.includes(existingService._id.toString())) {
      return res
        .status(403)
        .json({ message: "This service was not added by this user" });
    }

    // Update the service with new data
    existingService.serviceImageUrl = serviceImageUrl;
    existingService.serviceName = serviceName;
    existingService.serviceDescription = serviceDescription;
    existingService.serviceArea = serviceArea;
    existingService.price = price;
    existingService.serviceProviderImageUrl = serviceProviderImageUrl;
    existingService.serviceProviderName = serviceProviderName;
    existingService.serviceProviderEmail = serviceProviderEmail;
    await existingService.save();

    return res.status(201).json({
      message: "Service created successfully",
      service: existingService,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//Controller to delete an existing added service
export const deleteService = async (req, res) => {
  try {
    const { uid, serviceId } = req.body;

    // Find the user
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the service exists in user's addedServices
    if (!user.addServices.includes(serviceId)) {
      return res.status(403).json({
        success: false,
        message: "This service was not added by this user",
      });
    }

    // Delete the service from Service model
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Remove the serviceId from user's addServices array
    user.addServices = user.addServices.filter(
      (service) => service.toString() !== serviceId
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully!",
      deletedService,
    });
  } catch (error) {
    console.error("Error in deleteService:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID or service ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Controller to book a service
export const bookService = async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      serviceDescription,
      serviceImageUrl,
      serviceProviderImageUrl,
      serviceProviderEmail,
      serviceProviderName,
      currentUserEmail,
      currentUserName,
      serviceTakingDate,
      specialInstructions,
      price,
      serviceStatus,
    } = req.body;
   //console.log("serviceId", serviceId, "serviceTakingDate", serviceTakingDate , "price", price);
    // Find the current user
    const currentUser = await User.findOne({ email: currentUserEmail });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }
    // Find the service provider user
    const providerUser = await User.findOne({ email: serviceProviderEmail });
    if (!currentUser || !providerUser) {
      return res.status(404).json({ message: "User(s) not found." });
    }

    //Todo:  Check if service is already booked by the current user

    // Create the booked service object
    const bookedService = await BookedService.create({
      serviceId,
      serviceName,
      serviceDescription,
      serviceImageUrl,
      serviceProviderImageUrl,
      serviceProviderEmail,
      serviceProviderName,
      currentUserEmail,
      currentUserName,
      serviceTakingDate,
      specialInstructions,
      price,
      serviceStatus,
    });

    // Add service to user's bookedServices array
    currentUser.bookedServices.push(bookedService._id);
    await currentUser.save();

    // Add service to provider's todoServices array
    providerUser.todoServices.push(bookedService._id);
    await providerUser.save();

    return res.status(200).json({
      message: "Service booked successfully!",
      bookedService: bookedService,
    });
  } catch (error) {
    console.error("Error in bookService:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID or service ID format.",
      });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to get all booked services of a user
export const getUserBookedServices = async (req, res) => {
  try {
    const { uid } = req.params; // Get userId from URL params

    const user = await User.findOne({ firebaseUid: uid }).populate("bookedServices"); // Populate the bookedServices array

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the populated bookedServices array
    return res.status(200).json({
      message: "User booked services fetched successfully.",
      bookedServices: user.bookedServices,
      count: user.bookedServices.length,
    });
  } catch (error) {
    console.error("Error in getUserBookedServices:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format." });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to get all the todo services of a user
export const getUserToDoServices = async (req, res) => {
  try {
    const { uid } = req.params; // Get userId from URL params

    const user = await User.findOne({ firebaseUid: uid }).populate("todoServices"); // Populate the bookedServices array

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the populated bookedServices array
    return res.status(200).json({
      message: "User booked services fetched successfully.",
      todoServices: user.todoServices,
      count: user.todoServices.length,
    });
  } catch (error) {
    console.error("Error in getUserBookedServices:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format." });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to update the status of a todo service
export const updateToDoServiceStatus = async (req, res) => {
  try {
    const { uid, serviceId, newStatus } = req.body;

    // Find the user
    const user = await User.findOne({ firebaseUid: uid }).populate("todoServices");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the service
    const service = await BookedService.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Ensure the service is part of user's todoServices
    const isServiceInTodo = user.todoServices.some(
      (todoService) => todoService._id.toString() === service._id.toString()
    );
    if (!isServiceInTodo) {
      return res.status(403).json({
        success: false,
        message: "Service does not belong to the user's todo services",
      });
    }

    // Update the service status
    service.serviceStatus = newStatus;
    await service.save();

    return res
      .status(200)
      .json({ success: true, message: "Service status updated!" , serviceId: service._id.toString()});
  } catch (error) {
    console.error("Error in updateServiceStatus:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID or service ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


