// KEEP FOR NOW
// Useful for saving AI generated study plans in the future

import mongoose from "mongoose";

const StudySuggestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  suggestedTime: { type: Date, required: true },
  reason: String
});

export default mongoose.models.StudySuggestion || mongoose.model("StudySuggestion", StudySuggestionSchema);
