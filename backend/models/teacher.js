import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    name: { type: String, required: true }, 
    iin: { type: String, required: true, unique: true }, 
}, { timestamps: true });

export default mongoose.model('Teacher', teacherSchema);
