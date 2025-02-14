import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: { type: String, required: true }, 
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, 
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
