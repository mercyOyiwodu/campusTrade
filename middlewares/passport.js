const  GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const Seller = require('../models/seller');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:1709/api/v1/auth/google/login"
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log("Profile: ", profile)
    try {
      // Find user with Sequelize where clause instead of Mongoose's findOne
      let seller = await Seller.findOne({
        where: { email: profile.emails[0].value }
      });
      
      if (!seller) {
        // Create new user with Sequelize create method instead of Mongoose's new model
        seller = await Seller.create({
          email: profile.emails[0].value,
          fullName: profile.displayName,
          isVerified: profile.emails[0].verified || false,
          password: ''
        });
        // No need for separate save() call with Sequelize create()
      }
      return cb(null, seller);
    } catch (error) {
      return cb(error, null)
    }
  }
));

passport.serializeUser((seller, cb) => {
  console.log('Seller Serialized:', seller);
  cb(null, seller.id)
});

// Fixed the deserializeUser function (it was incorrectly named serializeUser again)
passport.deserializeUser(async (id, cb) => {
  try {
    // Using Sequelize's findByPk instead of Sequelize's findById
    const seller = await Seller.findByPk(id);
    
    // Changed Seller to User to match the model name in the rest of the code
    if (!seller) {
      return cb(new Error('Seller not found'), null)
    }
    cb(null, seller)
  } catch (error) {
    cb(error, null)
  }
});

module.exports = passport;