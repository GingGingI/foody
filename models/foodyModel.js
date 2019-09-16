const mongoose = require('mongoose');

const foodySchema = new mongoose.Schema({
  Title: String,
  Class: String,
  MainMenu: String,
  AveragePrice: Number,
  location: { type: { type: String }, coordinates: [Number] },
  images: [String],
}, { collection: 'restaurant' });

//Save
foodySchema.statics.create = function(item) {
//  this === model
  let foodyItem = new this(item);
//  return Promise
  return foodyItem.save();
};
//Remove


//Get
foodySchema.statics.findAll = function() {
  return this.find({});
};
foodySchema.statics.findAsTitle = function(title) {
  return this.find({ Title: title });
};
foodySchema.statics.findAsDistance = function(lat, lng, distance) {
  return this.aggregate([{
    $geoNear: {
      near: {type: "point", coordinates: [parseFloat(lng), parseFloat(lat)]},
      spherical: true, distanceField: "dist.calculated", maxDistance: Number(distance)
    }
  }]);
};
foodySchema.statics.findOneAsDistance = function(lat, lng, distance) {
  return this.findAsDistance(lat,lng, distance).sample(1);
};

//Update

module.exports = mongoose.model('restaurant', foodySchema);
