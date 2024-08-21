import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import {Admin} from "../models";
import { config } from "dotenv";

config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "/api/auth/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await Admin.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }
                const newUser = new Admin({
                    googleId: profile.id,
                    email: profile.emails![0].value,
                });
                await newUser.save();
                done(null, newUser);
            } catch (err) {
                done(err, undefined);
            }
        }
    )
);

// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: process.env.FACEBOOK_CLIENT_ID!,
//             clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//             callbackURL: "/api/auth/auth/facebook/callback",
//             profileFields: ["emails"],
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 // const existingUser = await User.findOne({ facebookId: profile.id });
//                 // if (existingUser) {
//                 //     return done(null, existingUser);
//                 // }
//                 // const newUser = new User({
//                 //     facebookId: profile.id,
//                 //     email: profile.emails![0].value,
//                 // });
//                 // await newUser.save();
//                 // done(null, newUser);
//             } catch (err) {
//                 // done(err, null);
//             }
//         }
//     )
// );

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await Admin.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
