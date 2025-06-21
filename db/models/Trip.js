import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const transportSchema = new Schema({
  mode: String,
  from: String,
  to: String,
  duration: String
}, { _id: false });


const itineraryActivitySchema = new Schema({
  name: String,
  location: String,
  time: String,
  transportFromPrevious: transportSchema
}, { _id: false });


const itineraryDaySchema = new Schema({
  day: Number,
  plan: [itineraryActivitySchema]
}, { _id: false });


const cityHotelSchema = new Schema({
  city: String,
  cityCode: String,
  checkIn: String,
  checkOut: String,
  notes: String
}, { _id: false });


const citySchema = new Schema({
  name: String,
  startDate: String,
  endDate: String,
  activities: [itineraryDaySchema],
  notes: String
}, { _id: false });


const travellingSchema = new Schema({
  from: String,
  to: String,
  date: String,
  modeOfTransport: String,
  departure_airport_city_IATAcode: {
    type: String,
    default: null
  },
  destination_airport_city_IATAcode: {
    type: String,
    default: null
  },
  notes: String
}, { _id: false });

const tripSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  adults: String,
  children: String,
  infants: String,
  startDate: String,
  endDate: String,
  budget: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  travelerType: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends']
  },
  cities: [citySchema],
  hotels: [cityHotelSchema],
  travelling: [travellingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Trip = models?.Trip || model('Trip', tripSchema);
export default Trip;

