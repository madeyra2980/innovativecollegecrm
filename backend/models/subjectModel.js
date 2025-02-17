import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: { type: String, required: true }, 
}, { timestamps: true });


export default mongoose.model('Subject', subjectSchema);
