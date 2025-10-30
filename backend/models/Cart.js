import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    cartId: {
        type: String,
        required: true,
        unique: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: String,
            price: Number,
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            image: String
        }
    ],
    total: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;