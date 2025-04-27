// models/TimeSlot.js
const timeSlotSchema = new Schema({
    name: { type: String, required: true },  // "1 урок"
    startTime: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    endTime: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    isBreak: { type: Boolean, default: false },
    campus: { type: Schema.Types.ObjectId, ref: 'Campus' } 
  });