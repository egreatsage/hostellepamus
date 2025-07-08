"use client";

import { useForm } from "react-hook-form";

export default function BulkAddRooms({ onCancel, onBulkSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            block: "",
            roomNumberStart: null,
            roomNumberEnd: null,
            gender: "Male",
            capacity: 1,
            price: 0,
            status: "active"
        }
    });

    const handleFormSubmit = (data) => {
        if (data.roomNumberEnd < data.roomNumberStart) {
            alert("Room number end cannot be less than the start.");
            return;
        }
        onBulkSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <label htmlFor="block" className="block font-semibold mb-1">Block</label>
                <input
                    id="block"
                    {...register("block", { required: "Block is required" })}
                    className={`w-full border rounded px-3 py-2 ${errors.block ? "border-red-500" : "border-gray-300"}`}
                    placeholder="e.g. B"
                />
                {errors.block && <p className="text-red-600 text-sm">{errors.block.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="roomNumberStart" className="block font-semibold mb-1">Room Number Start</label>
                    <input
                        id="roomNumberStart"
                        type="number"
                        {...register("roomNumberStart", { required: "Start number is required", valueAsNumber: true })}
                        className={`w-full border rounded px-3 py-2 ${errors.roomNumberStart ? "border-red-500" : "border-gray-300"}`}
                        placeholder="e.g. 101"
                    />
                    {errors.roomNumberStart && <p className="text-red-600 text-sm">{errors.roomNumberStart.message}</p>}
                </div>
                <div>
                    <label htmlFor="roomNumberEnd" className="block font-semibold mb-1">Room Number End</label>
                    <input
                        id="roomNumberEnd"
                        type="number"
                        {...register("roomNumberEnd", { required: "End number is required", valueAsNumber: true })}
                        className={`w-full border rounded px-3 py-2 ${errors.roomNumberEnd ? "border-red-500" : "border-gray-300"}`}
                        placeholder="e.g. 110"
                    />
                    {errors.roomNumberEnd && <p className="text-red-600 text-sm">{errors.roomNumberEnd.message}</p>}
                </div>
            </div>

            {/* Other common fields */}
            <div>
                <label htmlFor="gender" className="block font-semibold mb-1">Gender</label>
                <select id="gender" {...register("gender")} className="w-full border rounded px-3 py-2 border-gray-300">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div>
                <label htmlFor="capacity" className="block font-semibold mb-1">Capacity</label>
                <input id="capacity" type="number" {...register("capacity", {valueAsNumber: true})} className="w-full border rounded px-3 py-2 border-gray-300" />
            </div>
            <div>
                <label htmlFor="price" className="block font-semibold mb-1">Price</label>
                <input id="price" type="number" {...register("price", {valueAsNumber: true})} className="w-full border rounded px-3 py-2 border-gray-300" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">
                    {isSubmitting ? "Adding..." : "Add Rooms"}
                </button>
            </div>
        </form>
    );
}