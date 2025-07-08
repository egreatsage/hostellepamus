"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function RoomInfoForm({ onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: defaultValues || {
      block: "",
      roomNumber: "",
      gender: "Male",
      capacity: 1,
      photoUrls: "",
      price: 0,
      status: "active",
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSubmit = async (data) => {
    try {
      // Convert photoUrls string to array by splitting on commas and trimming
      const photoUrlsArray = data.photoUrls
        ? data.photoUrls.split(",").map((url) => url.trim())
        : [];
      const submitData = { ...data, photoUrls: photoUrlsArray, capacity: Number(data.capacity), price: Number(data.price) };
      await onSubmit(submitData);
      setShowSuccess(true);
      reset();
    } catch (error) {
      console.error("Failed to save room");
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="block" className="block font-semibold mb-1">Block</label>
          <input
            id="block"
            {...register("block", { required: "Block is required" })}
            className={`w-full border rounded px-3 py-2 ${errors.block ? "border-red-500" : "border-gray-300"}`}
            placeholder="e.g. A"
          />
          {errors.block && <p className="text-red-600 text-sm">{errors.block.message}</p>}
        </div>

        <div>
          <label htmlFor="roomNumber" className="block font-semibold mb-1">Room Number</label>
          <input
            id="roomNumber"
            {...register("roomNumber", { required: "Room number is required" })}
            className={`w-full border rounded px-3 py-2 ${errors.roomNumber ? "border-red-500" : "border-gray-300"}`}
            placeholder="e.g. A101"
          />
          {errors.roomNumber && <p className="text-red-600 text-sm">{errors.roomNumber.message}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block font-semibold mb-1">Gender</label>
          <select
            id="gender"
            {...register("gender", { required: "Gender is required" })}
            className={`w-full border rounded px-3 py-2 ${errors.gender ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}
        </div>

        <div>
          <label htmlFor="capacity" className="block font-semibold mb-1">Capacity</label>
          <input
            id="capacity"
            type="number"
            min={1}
            {...register("capacity", { required: "Capacity is required", min: { value: 1, message: "Capacity must be at least 1" } })}
            className={`w-full border rounded px-3 py-2 ${errors.capacity ? "border-red-500" : "border-gray-300"}`}
            placeholder="Number of occupants"
          />
          {errors.capacity && <p className="text-red-600 text-sm">{errors.capacity.message}</p>}
        </div>

        <div>
          <label htmlFor="photoUrls" className="block font-semibold mb-1">Photo URLs (comma separated)</label>
          <input
            id="photoUrls"
            {...register("photoUrls")}
            className="w-full border rounded px-3 py-2 border-gray-300"
            placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
          />
        </div>

        <div>
          <label htmlFor="price" className="block font-semibold mb-1">Price (per month)</label>
          <input
            id="price"
            type="number"
            min={0}
            step="0.01"
            {...register("price", { required: "Price is required", min: { value: 0, message: "Price cannot be negative" } })}
            className={`w-full border rounded px-3 py-2 ${errors.price ? "border-red-500" : "border-gray-300"}`}
            placeholder="e.g. 500"
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block font-semibold mb-1">Status</label>
          <select
            id="status"
            {...register("status", { required: "Status is required" })}
            className={`w-full border rounded px-3 py-2 ${errors.status ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Room"}
        </button>
      </form>
    </div>
  );
}
