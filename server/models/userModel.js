import mongoose from "mongoose";
import bcrypt from "bcrypt"; 

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        index: true
    },
    lastname: {
        type: String,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        selet: false,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken: {
        type: String,
    },
},
{timestamps: true});

userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function(entredPassword) {
    return await bcrypt.compare(entredPassword, this.password);
}

export default mongoose.model("User", userSchema);