import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name:{type: 'string', required:true},
    email:{type: 'string', requird:true},
    subject:{type: 'string', required:true},
    message:{type: 'string', required:true},
    createdAt:{type: Date, default: Date.now}
});

const Contact = mongoose.models.Contact || mongoose.model("Contact",contactSchema);

export default Contact;