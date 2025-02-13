import mongoose from "mongoose";
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: { type: String, required: true }, // Например, "ЭЖК-21"
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Студенты группы
    schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }] // Расписание занятий
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
