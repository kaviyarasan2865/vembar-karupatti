import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    feedback:{
        type: String,
        required:true
    },
    rating:{
        type: Number,
        min:1,
        max:5,
        required:true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date
    }
});

const Review = new mongoose.models.Review ||  mongoose.model("Review",reviewSchema);

export default Review;