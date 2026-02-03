const Vehicle = require("../models/Vehicle");

// @desc    Get all vehicles (with optional filters)
// @route   GET /api/vehicles?type=car&available=true
// @access  Public
const getAllVehicles = async (req, res) => {
  try {
    const { type, available } = req.query;

    // Build filter object
    const filter = {};

    if (type) {
      filter.type = type.toLowerCase();
    }

    if (available !== undefined) {
      filter.isAvailable = available === "true";
    }

    // Fetch vehicles with filters
    const vehicles = await Vehicle.find(filter)
      .populate("addedBy", "name email")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: { vehicles },
    });
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "addedBy",
      "name email",
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { vehicle },
    });
  } catch (error) {
    console.error("Get vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
    });
  }
};

// @desc    Add new vehicle (Admin only)
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      pricePerDay,
      fuelType,
      image,
      brand,
      model,
      year,
      seatingCapacity,
      features,
    } = req.body;

    // Create vehicle with admin ID
    const vehicle = await Vehicle.create({
      name,
      type,
      pricePerDay,
      fuelType,
      image,
      brand,
      model,
      year,
      seatingCapacity,
      features,
      addedBy: req.user._id, // Admin who added it
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: { vehicle },
    });
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add vehicle",
    });
  }
};

// @desc    Update vehicle (Admin only)
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Update vehicle fields
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validations
      },
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: { vehicle: updatedVehicle },
    });
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update vehicle",
    });
  }
};

// @desc    Delete vehicle (Admin only)
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
