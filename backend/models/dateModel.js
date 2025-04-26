import mongoose from "mongoose";
const Schema = mongoose.Schema;

const dateSchema = new Schema({
    date: { type: Date, required: true }, 
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', require:"true" },
}, { timestamps: true });

export default mongoose.model('Date', dateSchema);