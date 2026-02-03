import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Shield,
  Clock,
  IndianRupee,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { getAllVehicles } from "../api/vehicleApi";
import VehicleCard from "../components/vehicle/VehicleCard";
import Loader from "../components/common/Loader";

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getAllVehicles({ available: true });
        setFeaturedVehicles(response.data.vehicles.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const features = [
    {
      icon: <Car className="h-12 w-12" />,
      title: "Wide Selection",
      description: "Cars, bikes, and scooties for every kind of journey",
    },
    {
      icon: <IndianRupee className="h-12 w-12" />,
      title: "Transparent Pricing",
      description: "What you see is what you pay — no hidden charges",
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Verified Vehicles",
      description: "All vehicles are quality-checked and insured",
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: "Quick Booking",
      description: "Book your ride in under a minute",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      {/* HERO */}
      <section className="bg-bg-surface-light py-20 text-center dark:bg-bg-surface-dark">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Rent Your Perfect Ride
          </h1>
          <p className="mb-8 text-lg text-text-muted-light dark:text-text-muted-dark">
            Reliable cars and bikes for daily use, trips, and business travel
          </p>
          <Link
            to="/vehicles"
            className="inline-block rounded-lg bg-accent px-8 py-3 text-lg font-medium text-white hover:opacity-90"
          >
            Browse Vehicles
          </Link>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">About DriveEase</h2>
          <p className="mx-auto max-w-3xl text-text-muted-light dark:text-text-muted-dark">
            DriveEase is a modern vehicle rental platform designed for
            simplicity, transparency, and reliability. Whether you need a car
            for a weekend trip, a bike for daily commute, or a vehicle for
            business use — DriveEase lets you book quickly without paperwork or
            confusion.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-bg-surface-light py-20 dark:bg-bg-surface-dark">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <MapPin className="h-10 w-10" />,
                title: "Choose a Vehicle",
                desc: "Browse available vehicles and pick what suits your needs",
              },
              {
                icon: <Clock className="h-10 w-10" />,
                title: "Select Dates",
                desc: "Choose pickup and drop-off dates with transparent pricing",
              },
              {
                icon: <CheckCircle className="h-10 w-10" />,
                title: "Confirm Booking",
                desc: "Instant confirmation after payment",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-lg bg-bg-primary-light p-6 text-center shadow-sm dark:bg-bg-primary-dark"
              >
                <div className="mb-4 flex justify-center text-accent">
                  {step.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose DriveEase
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg bg-bg-surface-light p-6 text-center shadow-sm hover:shadow-md dark:bg-bg-surface-dark"
              >
                <div className="mb-4 flex justify-center text-accent">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Featured Vehicles
          </h2>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/vehicles"
                  className="inline-block rounded-lg bg-accent px-6 py-2 text-white hover:opacity-90"
                >
                  View All Vehicles
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-surface-light py-20 dark:bg-bg-surface-dark">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Hit the Road?</h2>
          <p className="mb-8 text-lg text-text-muted-light dark:text-text-muted-dark">
            Sign up now and book your ride in minutes
          </p>
          <Link
            to="/register"
            className="inline-block rounded-lg bg-accent px-8 py-3 text-lg font-medium text-white hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
