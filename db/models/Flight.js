import mongoose from 'mongoose';

const BaggageSchema = new mongoose.Schema({
  weight: Number,
  weightUnit: String
}, { _id: false });

const AmenitySchema = new mongoose.Schema({
  description: String,
  isChargeable: Boolean,
  amenityType: String,
  providerName: String
}, { _id: false });

const SegmentSchema = new mongoose.Schema({
  departureAirport: String,
  arrivalAirport: String,
  departureTime: Date,
  arrivalTime: Date,
  carrierCode: String,
  flightNumber: String,
  duration: String,
  aircraftCode: String,
  cabin: String,
  fareBasis: String,
  brandedFare: String,
  brandedFareLabel: String,
  class: String,
  includedCheckedBags: BaggageSchema,
  includedCabinBags: BaggageSchema,
  amenities: [AmenitySchema]
}, { _id: false });

const ItinerarySchema = new mongoose.Schema({
  duration: String,
  segments: [SegmentSchema]
}, { _id: false });

const TravelerPricingSchema = new mongoose.Schema({
  travelerType: String,
  fareOption: String,
  price: {
    currency: String,
    total: String,
    base: String
  },
  fareDetailsBySegment: [{
    segmentIndex: Number,
    cabin: String,
    fareBasis: String,
    brandedFare: String,
    brandedFareLabel: String,
    class: String,
    includedCheckedBags: BaggageSchema,
    includedCabinBags: BaggageSchema,
    amenities: [AmenitySchema]
  }]
}, { _id: false });

const FlightOfferSchema = new mongoose.Schema({
  from: String,
  to: String,
  date: Date,
  price: {
    currency: String,
    total: String,
    base: String
  },
  airline: String,
  numberOfStops: Number,
  lastTicketingDate: String,
  itineraries: [ItinerarySchema],
  travelerPricings: [TravelerPricingSchema],
  bookingUrl: String, // Optional custom or external booking page
  validatingAirlineCodes: [String],
  source: String,
  isOneWay: Boolean,
  instantTicketingRequired: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Flight || mongoose.model("Flight", FlightOfferSchema);
