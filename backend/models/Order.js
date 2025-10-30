import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    items: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],
    total: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["pending", "completed", "shipped"],
        default: "completed"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Order = mongoose.model("Order", orderSchema);
export default Order;