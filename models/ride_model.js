var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserRide = new Schema({
    username: {

        type:String,
        default:''
  
      },
    location: {

      type: String,
        default: ''

    },
    destination: {

      type: String,
        default: ''

    },
  
    date_of_ride: {

        type:String,
        default:''
  
      },
      person_allowed: {

        type:String,
        default:''
  
      },
      description: {

        type:String,
        default:''
  
      },
 
},{timestamps:true});

module.exports = mongoose.model('UserRide', UserRide);