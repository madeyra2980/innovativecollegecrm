import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true }, // ФИО студента
    role: { type: String, enum: ['student', 'teacher', 'admin'], required: true }, // Кто это (студент, учитель, админ)
    iin: { type: String, required: true, unique: true }, // ИИН студента (уникальный)
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Группа студента
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], // Предметы (если учитель)
}, { timestamps: true });

export default mongoose.model('User', userSchema);
