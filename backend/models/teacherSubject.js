import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teacherSubjectstSchema = new Schema({
    name: { type: String, required: true }, 
    iin: { type: String, required: true, unique: true }, 
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
}, { timestamps: true });

export default mongoose.model('Teachersubject', teacherSubjectstSchema);
