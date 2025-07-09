// src/components/StudentInfoForm.js
"use client";

import { useForm } from "react-hook-form";

export default function StudentInfoForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const inputClasses = (error) => `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ease-in-out
    text-base font-medium placeholder-gray-500
    ${error 
      ? 'border-red-400 focus:border-red-500 bg-red-50 text-red-900' 
      : 'border-gray-300 focus:border-[#D4AA7D] bg-white text-[#272727] hover:border-[#EFD09E]'
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-20
    ${error ? 'focus:ring-red-500' : 'focus:ring-[#D4AA7D]'}
  `;

  const labelClasses = "block text-sm font-bold text-[#272727] mb-2 tracking-wide";
  const errorClasses = "text-red-600 text-sm mt-1 font-medium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#272727] to-[#3a3a3a] px-6 py-8 sm:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Student Information Form
            </h1>
            <p className="text-[#EFD09E] text-center mt-2 text-sm sm:text-base">
              Please fill in all the required information below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="fullName" className={labelClasses}>
                  Full Name *
                </label>
                <input 
                  id="fullName" 
                  {...register("fullName", { required: "Full name is required" })} 
                  className={inputClasses(errors.fullName)} 
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className={errorClasses}>{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="phoneNumber" className={labelClasses}>
                  Phone Number *
                </label>
                <input 
                  id="phoneNumber" 
                  type="tel" 
                  {...register("phoneNumber", { 
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: "Please enter a valid phone number"
                    }
                  })} 
                  className={inputClasses(errors.phoneNumber)} 
                  placeholder="0712345678"
                />
                {errors.phoneNumber && (
                  <p className={errorClasses}>{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="gender" className={labelClasses}>
                  Gender *
                </label>
                <select 
                  id="gender" 
                  {...register("gender", { required: "Gender is required" })} 
                  className={inputClasses(errors.gender)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className={errorClasses}>{errors.gender.message}</p>
                )}
              </div>

              {/* Home County */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="homeCounty" className={labelClasses}>
                  Home County
                </label>
                <input 
                  id="homeCounty" 
                  {...register("homeCounty")} 
                  className={inputClasses(errors.homeCounty)} 
                  placeholder="e.g., Nairobi"
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="location" className={labelClasses}>
                  Location
                </label>
                <input 
                  id="location" 
                  {...register("location")} 
                  className={inputClasses(errors.location)} 
                  placeholder="e.g., South B"
                />
              </div>

              {/* Former School */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="formerHighSchool" className={labelClasses}>
                  Former High School
                </label>
                <input 
                  id="formerHighSchool" 
                  {...register("formerHighSchool")} 
                  className={inputClasses(errors.formerHighSchool)} 
                  placeholder="e.g., Alliance High School"
                />
              </div>

              {/* Mother's Name */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="mothersName" className={labelClasses}>
                  Mother's Name
                </label>
                <input 
                  id="mothersName" 
                  {...register("mothersName")} 
                  className={inputClasses(errors.mothersName)} 
                  placeholder="Enter mother's full name"
                />
              </div>

              {/* Mother's Contact */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="mothersNumber" className={labelClasses}>
                  Mother's Contact
                </label>
                <input 
                  id="mothersNumber" 
                  type="tel"
                  {...register("mothersNumber")} 
                  className={inputClasses(errors.mothersNumber)} 
                  placeholder="0712345678"
                />
              </div>

              {/* Father's Name */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="fathersName" className={labelClasses}>
                  Father's Name
                </label>
                <input 
                  id="fathersName" 
                  {...register("fathersName")} 
                  className={inputClasses(errors.fathersName)} 
                  placeholder="Enter father's full name"
                />
              </div>

              {/* Father's Contact */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="fathersNumber" className={labelClasses}>
                  Father's Contact
                </label>
                <input 
                  id="fathersNumber" 
                  type="tel"
                  {...register("fathersNumber")} 
                  className={inputClasses(errors.fathersNumber)} 
                  placeholder="0712345678"
                />
              </div>

              {/* Guardian Name */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="guardianName" className={labelClasses}>
                  Guardian Name
                </label>
                <input 
                  id="guardianName" 
                  {...register("guardianName")} 
                  className={inputClasses(errors.guardianName)} 
                  placeholder="Enter guardian's full name"
                />
              </div>

              {/* Guardian Contact */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="guardianNumber" className={labelClasses}>
                  Guardian Contact
                </label>
                <input 
                  id="guardianNumber" 
                  type="tel"
                  {...register("guardianNumber")} 
                  className={inputClasses(errors.guardianNumber)} 
                  placeholder="0712345678"
                />
              </div>

              {/* School/University */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="school" className={labelClasses}>
                  School/University
                </label>
                <input 
                  id="school" 
                  {...register("school")} 
                  className={inputClasses(errors.school)} 
                  placeholder="e.g., University of Nairobi"
                />
              </div>

              {/* Course */}
              <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="course" className={labelClasses}>
                  Course
                </label>
                <input 
                  id="course" 
                  {...register("course")} 
                  className={inputClasses(errors.course)} 
                  placeholder="e.g., B.Sc. Computer Science"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isLoading} 
                className={`
                  w-full py-4 px-6 rounded-lg text-lg font-bold transition-all duration-300
                  transform hover:scale-[1.02] active:scale-[0.98]
                  shadow-lg hover:shadow-xl
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#272727] to-[#3a3a3a] hover:from-[#3a3a3a] hover:to-[#272727]'
                  }
                  text-white
                  focus:outline-none focus:ring-4 focus:ring-[#D4AA7D] focus:ring-opacity-50
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Complete Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}