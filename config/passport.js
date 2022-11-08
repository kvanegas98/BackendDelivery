const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const Keys = require('./keys');
const User = require('../models/user');


module.exports=(passport)=>{
    let opst ={};
    opst.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opst.secretOrKey = Keys.secretOrKey;

    passport.use(new JwtStrategy(opst, (jwt_payload, done)=>{
        User.findById(jwt_payload.id, (err, user)=>{
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null,user);
            }
            else{
                return done(null, false); 
            }
        });
    }));
}

