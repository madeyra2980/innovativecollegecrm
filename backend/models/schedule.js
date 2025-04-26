import mongoose from "mongoose";
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', require:"true" },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', require:"true" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', require:"true" },
    time: { type: String, required: true }, 
    room: { type: String, required: true }, 
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);
