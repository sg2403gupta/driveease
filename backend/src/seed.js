require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const Booking = require("./models/Booking");
const Payment = require("./models/Payment");

// DATABASE
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");
};

// CLEAR DATABASE
const clearDatabase = async () => {
  await User.deleteMany({});
  await Vehicle.deleteMany({});
  await Booking.deleteMany({});
  await Payment.deleteMany({});
  console.log("Database cleared");
};

// USERS
const seedUsers = async () => {
  const users = await User.create([
    {
      name: "Shubham Gupta",
      email: "shubham123@demo.com",
      password: "password123",
      phone: "9999999999",
      role: "admin",
      isActive: true,
    },
    {
      name: "Rahul Singh",
      email: "rahul123@demo.com",
      password: "password123",
      phone: "8888888888",
      role: "user",
      isActive: true,
    },
  ]);

  console.log("Users seeded:", users.length);
  return users;
};

// VEHICLES
const seedVehicles = async (adminId) => {
  const vehicles = [
    {
      name: "Premium Sedan",
      type: "car",
      brand: "Honda",
      model: "City",
      year: 2023,
      description:
        "The Honda City is a premium sedan offering excellent comfort, smooth handling, advanced safety features, and high fuel efficiency for city and highway driving.",
      pricePerDay: 1500,
      fuelType: "petrol",
      seatingCapacity: 5,
      image: "vehicles/cars/car-honda-city.webp",
      features: ["AC", "ABS", "Airbags", "Music System"],
      isAvailable: true,
      addedBy: adminId,
    },
    {
      name: "Luxury SUV",
      type: "car",
      brand: "Toyota",
      model: "Fortuner",
      year: 2023,
      description:
        "The Toyota Fortuner is a powerful luxury SUV designed for long journeys and tough terrains, offering premium interiors, strong performance, and excellent road presence.",
      pricePerDay: 3200,
      fuelType: "diesel",
      seatingCapacity: 7,
      image: "vehicles/cars/car-toyota-fortuner.webp",
      features: ["Cruise Control", "Leather Seats", "Sunroof"],
      isAvailable: true,
      addedBy: adminId,
    },
    {
      name: "Compact Hatchback",
      type: "car",
      brand: "Maruti",
      model: "Swift",
      year: 2022,
      description:
        "The Maruti Swift is a compact and fuel-efficient hatchback that is easy to drive in traffic, affordable to maintain, and ideal for daily city commuting.",
      pricePerDay: 1200,
      fuelType: "petrol",
      seatingCapacity: 5,
      image: "vehicles/cars/car-maruti-swift.webp",
      features: ["Bluetooth", "Power Steering"],
      isAvailable: true,
      addedBy: adminId,
    },
    {
      name: "Electric SUV",
      type: "car",
      brand: "Tata",
      model: "Nexon EV",
      year: 2023,
      description:
        "The Tata Nexon EV is a modern electric SUV that delivers silent performance, instant torque, zero emissions, and a smooth driving experience for urban users.",
      pricePerDay: 2000,
      fuelType: "electric",
      seatingCapacity: 5,
      image: "vehicles/cars/car-tata-nexon-ev.webp",
      features: ["Fast Charging", "Digital Display"],
      isAvailable: true,
      addedBy: adminId,
    },
    {
      name: "Family MPV",
      type: "car",
      brand: "Toyota",
      model: "Innova Crysta",
      year: 2023,
      description:
        "The Toyota Innova Crysta is a spacious and reliable family MPV known for comfort, durability, smooth long-distance performance, and excellent passenger space.",
      pricePerDay: 3000,
      fuelType: "diesel",
      seatingCapacity: 8,
      image: "vehicles/cars/car-toyota-innova.webp",
      features: ["Captain Seats", "Rear Camera"],
      isAvailable: true,
      addedBy: adminId,
    },

    {
      name: "Classic Cruiser",
      type: "bike",
      brand: "Royal Enfield",
      model: "Classic 350",
      year: 2023,
      description:
        "The Royal Enfield Classic 350 is a legendary cruiser motorcycle featuring iconic styling, relaxed ergonomics, smooth engine performance, and excellent highway comfort.",
      pricePerDay: 800,
      fuelType: "petrol",
      image: "vehicles/bikes/bike-royal-enfield-classic-350.webp",
      features: ["ABS", "Comfort Seat"],
      isAvailable: true,
      addedBy: adminId,
    },
    {
      name: "Sports Bike",
      type: "bike",
      brand: "Yamaha",
      model: "R15 V4",
      year: 2023,
      description:
        "The Yamaha R15 V4 is a performance-oriented sports bike offering sharp handling, aerodynamic design, advanced riding technology, and excellent control at high speeds.",
      pricePerDay: 1000,
      fuelType: "petrol",
      image: "vehicles/bikes/bike-yamaha-r15.webp",
      features: ["Quick Shifter", "Digital Console"],
      isAvailable: true,
      addedBy: adminId,
    },

    {
      name: "Electric Scooty",
      type: "scooty",
      brand: "Ather",
      model: "450X",
      year: 2023,
      description:
        "The Ather 450X is a premium electric scooty offering fast charging, smart touchscreen features, smooth acceleration, and an eco-friendly urban commuting experience.",
      pricePerDay: 600,
      fuelType: "electric",
      image: "vehicles/scooties/scooty-ather-450x.webp",
      features: ["Touchscreen", "Fast Charging"],
      isAvailable: true,
      addedBy: adminId,
    },
    {
      name: "Daily Commuter Scooty",
      type: "scooty",
      brand: "Honda",
      model: "Activa 6G",
      year: 2023,
      description:
        "The Honda Activa 6G is one of India’s most trusted daily commuter scooties, known for smooth performance, excellent mileage, rider comfort, and long-term reliability.",
      pricePerDay: 450,
      fuelType: "petrol",
      image: "vehicles/scooties/scooty-honda-activa-6g.webp",
      features: ["Comfort Seat", "Boot Space"],
      isAvailable: true,
      addedBy: adminId,
    },
  ];

  await Vehicle.insertMany(vehicles);
  console.log("Vehicles seeded:", vehicles.length);
};
// SEEDING DATA TO DB
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();

    const users = await seedUsers();
    const admin = users.find((u) => u.role === "admin");

    await seedVehicles(admin._id);

    console.log("\n Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
