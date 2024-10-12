import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  albumArt: { type: String, required: true },
  audioUrl: { type: String, required: true },
  isSongOfTheWeek: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
});

export default mongoose.models.Song || mongoose.model('Song', SongSchema);