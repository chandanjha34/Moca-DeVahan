import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'dealer', 'service'], default: 'user' },

});


const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
