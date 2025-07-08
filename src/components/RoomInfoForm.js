"use client";

import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  UserGroupIcon, 
  CameraIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function RoomInfoForm({ onSubmit, defaultValues, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
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

  const watchedStatus = watch("status");

  const handleFormSubmit = async (data) => {
    try {
      const photoUrlsArray = data.photoUrls
        ? data.photoUrls.split(",").map((url) => url.trim())
        : [];
      const submitData = { 
        ...data, 
        photoUrls: photoUrlsArray, 
        capacity: Number(data.capacity), 
        price: Number(data.price) 
      };
      await onSubmit(submitData);
      reset();
    } catch (error) {
      console.error("Failed to save room");
    }
  };

  const inputClasses = (error) => `
    w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
      : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
    }
    placeholder-slate-400 text-slate-800
  `;

  const labelClasses = "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <div>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Block Input */}
        <div className="space-y-2">
          <label htmlFor="block" className={labelClasses}>
            <div className="flex items-center space-x-2">
              <BuildingOfficeIcon className="h-4 w-4 text-slate-500" />
              <span>Block</span>
            </div>
          </label>
          <input
            id="block"
            {...register("block", { required: "Block is required" })}
            className={inputClasses(errors.block)}
            placeholder="Enter block (e.g., A, B, C)"
          />
          {errors.block && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <XMarkIcon className="h-4 w-4" />
              <span>{errors.block.message}</span>
            </p>
          )}
        </div>

        {/* Room Number Input */}
        <div className="space-y-2">
          <label htmlFor="roomNumber" className={labelClasses}>
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-4 w-4 text-slate-500" />
              <span>Room Number</span>
            </div>
          </label>
          <input
            id="roomNumber"
            {...register("roomNumber", { required: "Room number is required" })}
            className={inputClasses(errors.roomNumber)}
            placeholder="Enter room number (e.g., A101, B205)"
          />
          {errors.roomNumber && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <XMarkIcon className="h-4 w-4" />
              <span>{errors.roomNumber.message}</span>
            </p>
          )}
        </div>

        {/* Gender Selection */}
        <div className="space-y-2">
          <label htmlFor="gender" className={labelClasses}>
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-4 w-4 text-slate-500" />
              <span>Gender</span>
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <input
                type="radio"
                {...register("gender", { required: "Gender is required" })}
                value="Male"
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-slate-50">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-700">Male</div>
                </div>
              </div>
            </label>
            <label className="relative">
              <input
                type="radio"
                {...register("gender", { required: "Gender is required" })}
                value="Female"
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-pink-500 peer-checked:bg-pink-50 hover:bg-slate-50">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-700">Female</div>
                </div>
              </div>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <XMarkIcon className="h-4 w-4" />
              <span>{errors.gender.message}</span>
            </p>
          )}
        </div>

        {/* Capacity Input */}
        <div className="space-y-2">
          <label htmlFor="capacity" className={labelClasses}>
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-4 w-4 text-slate-500" />
              <span>Capacity</span>
            </div>
          </label>
          <input
            id="capacity"
            type="number"
            min={1}
            {...register("capacity", { 
              required: "Capacity is required", 
              min: { value: 1, message: "Capacity must be at least 1" } 
            })}
            className={inputClasses(errors.capacity)}
            placeholder="Number of occupants"
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <XMarkIcon className="h-4 w-4" />
              <span>{errors.capacity.message}</span>
            </p>
          )}
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <label htmlFor="price" className={labelClasses}>
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-4 w-4 text-slate-500" />
              <span>Price (per month)</span>
            </div>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
            <input
              id="price"
              type="number"
              min={0}
              step="0.01"
              {...register("price", { 
                required: "Price is required", 
                min: { value: 0, message: "Price cannot be negative" } 
              })}
              className={`${inputClasses(errors.price)} pl-8`}
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <XMarkIcon className="h-4 w-4" />
              <span>{errors.price.message}</span>
            </p>
          )}
        </div>

        {/* Photo URLs Input */}
        <div className="space-y-2">
          <label htmlFor="photoUrls" className={labelClasses}>
            <div className="flex items-center space-x-2">
              <CameraIcon className="h-4 w-4 text-slate-500" />
              <span>Photo URLs</span>
              <span className="text-slate-400 text-xs">(optional)</span>
            </div>
          </label>
          <textarea
            id="photoUrls"
            {...register("photoUrls")}
            rows={3}
            className={inputClasses()}
            placeholder="Enter photo URLs separated by commas&#10;https://example.com/photo1.jpg,&#10;https://example.com/photo2.jpg"
          />
          <p className="text-slate-500 text-xs">Separate multiple URLs with commas</p>
        </div>

        {/* Status Selection */}
        <div className="space-y-2">
          <label htmlFor="status" className={labelClasses}>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-4 w-4 text-slate-500" />
              <span>Status</span>
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <input
                type="radio"
                {...register("status", { required: "Status is required" })}
                value="active"
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-slate-50">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </div>
                </div>
              </div>
            </label>
            <label className="relative">
              <input
                type="radio"
                {...register("status", { required: "Status is required" })}
                value="inactive"
                className="sr-only peer"
              />
              <div className="p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-slate-50">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Inactive</span>
                  </div>
                </div>
              </div>
            </label>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <XMarkIcon className="h-4 w-4" />
              <span>{errors.status.message}</span>
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-xl transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Save Room</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}