import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    image:{
        type:String,
        required:true,
        trim:true
    }
}, {
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;