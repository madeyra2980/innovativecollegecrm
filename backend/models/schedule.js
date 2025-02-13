import mongoose from "mongoose";
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    date: { type: Date, required: true }, 
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    time: { type: String, required: true }, 
    room: { type: String, required: true }, 
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);
