import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isViewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
