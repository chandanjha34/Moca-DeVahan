import React, { useState } from "react";

function AddService() {
  const [form, setForm] = useState({
    vehicleId: "",
    serviceType: "",
    mileage: "",
    partsReplaced: "",
    technicianName: "",
    date: "",
    cost: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Upload JSON to 0G (mock API)
      const uploadRes = await fetch("http://localhost:3000/api/uploadJSON", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await uploadRes.json();
      const hash = data.rootHash;
      // Step 2: Save hash to MongoDB
      await fetch("http://localhost:3000/addService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: form.vehicleId, serviceHash: hash }),
      });

      alert("✅ Service record added successfully!");
      setForm({
        vehicleId: "",
        serviceType: "",
        mileage: "",
        partsReplaced: "",
        technicianName: "",
        date: "",
        cost: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting:", error);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-300 p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Vehicle Service Record</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          name="vehicleId"
          placeholder="Vehicle ID"
          value={form.vehicleId}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-yellow-400"
          required
        />
        <input
          type="text"
          name="serviceType"
          placeholder="Service Type"
          value={form.serviceType}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-yellow-400"
          required
        />
        <input
          type="number"
          name="mileage"
          placeholder="Mileage"
          value={form.mileage}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-yellow-400"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-yellow-400"
        />
        <input
          type="text"
          name="partsReplaced"
          placeholder="Parts Replaced"
          value={form.partsReplaced}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-yellow-400"
        />
        <input
          type="text"
          name="technicianName"
          placeholder="Technician Name"
          value={form.technicianName}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-yellow-400"
        />
        <input
          type="number"
          name="cost"
          placeholder="Service Cost"
          value={form.cost}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-yellow-400"
        />
        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-yellow-400"
        />
        <button
          type="submit"
          className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-yellow-300 transition"
        >
          Add Service
        </button>
      </form>
    </div>
  );
}

export default AddService;
