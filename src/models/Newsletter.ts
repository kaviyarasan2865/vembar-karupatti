import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
email:{
    type: String,
    required: true,
    unique: [true,'email already exists'],
    lowercase: true
}
});

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter',NewsletterSchema);

export default Newsletter;
