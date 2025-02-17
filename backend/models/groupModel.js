import mongoose from "mongoose";
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: { type: String, required: true }, 
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], 
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);