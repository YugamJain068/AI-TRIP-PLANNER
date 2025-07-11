import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    minlength: 6,  // Minimum for credentials users
  },

  profileImage: {
    type: String,
    default: "",
  },

  oauthProvider: {
    type: String,  // e.g., 'google', 'facebook', 'github'
  },

  oauthId: {
    type: String,  // Provider's user ID
  },

  createdTrips: [{
    type: Schema.Types.ObjectId,
    ref: 'Trip',
  }],

  registeredTrips: [{
    type: Schema.Types.ObjectId,
    ref: 'Trip',
  }],

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model('User', userSchema);
export default User;

