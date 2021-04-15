const config = require("config");
const bcrypt = require("bcryptjs");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

module.exports = (io, socket) => {
    const registerUser = async (accountData, callback) => {
        try {
            const {email, password} = accountData;
 
            emailPasswordCheck(email, password, callback);
            /*
            if (!emailValidator.validate(email)) {
                return callback({
                    success: false,
                    message: "Email does not match required pattern"
                });
            }
            if (password.length == 0 || password.length < 8) {
                return callback({
                    success: false,
                    message: "Password must be at least 8 symbols long"
                });
            }
            */

            const candidate = await User.findOne({ email });
    
            if (candidate) {
                return callback({
                    success: false,
                    message: "The user already exists"
                });
            }
    
            const passwordHash = await bcrypt.hash(password, 12);
            const user = new User({ email, password: passwordHash });
    
            await user.save();
    
            callback({
                success: true
            });
    
        } catch (e) {
            callback({
                success: false,
                message: "Something went wrong, try again. Error: " + e.message
            });
            console.log(e.message);
        }
    }

    const loginUser = async (accountData, callback) => {
        try {
            // Gets the user from DB.
            const {email, password} = accountData;

            emailPasswordCheck(email, password, callback);

            const user = await User.findOne({ email });
            if (!user) {
                return callback({
                    success: false,
                    message: "The user not found"
                });
            }
            
            // Checks whether the sent password matches the one from DB.
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return callback({
                    success: false,
                    message: "Invalid data, try again"
                });
            }
    
            // jwt.sign(payload, secretOrPrivateKey, [options, callback])
            const token = jwt.sign(
                { userId: user.id },
                config.get("jwtSecret"),
                { expiresIn: "2h" }
            );
    
            callback({
                success: true,
                token,
                userId: user.id
            });
        } catch (e) {
            callback({
                success: false,
                message: "Something went wrong, try again"
            });
        }
    }
    
    const authUser = (token, callback) => {
        try {
            // Checking whether the token is empty.
            if (!token) {
                return callback({
                    ok: false,
                    message: "No authorization"
                    });
            }

            // Checking whether the token was changed.
            const decodedToken = jwt.verify(token, config.get("jwtSecret"));
            callback({
                ok: true,
                userId: decodedToken.userId
            });
        } catch (e) {
            callback({
                ok: false,
                message: e.message
            });
        }
    }

    const emailPasswordCheck = (email, password, callback) => {
        if (!emailValidator.validate(email)) {
            return callback({
                success: false,
                message: "Email does not match required pattern"
            });
        }
        if (password.length == 0 || password.length < 8) {
            return callback({
                success: false,
                message: "Password must be at least 8 symbols long"
            });
        }
    }

    socket.on("user:auth", authUser);
    socket.on("user:register", registerUser);
    socket.on("user:login", loginUser);
}
