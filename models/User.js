import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        userRole: {
            type: String,
            enum : ['user','admin','head','worker'],
            required: true,
        },
        status: {
            type: String,
            enum : ['active','inactive'],
            default: 'active'
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        birthday: {
            type: Date,
            required: true
        },
        avatarUrl: String,
    },
    {
        timestamps: true,
    });

export default mongoose.model("User", UserSchema);