import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: { type: String, required: true }, // Название предмета (например, "Математика")
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Учитель
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
