const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const createToken = require('../utils/createToken');
const pool = require('../database/config');
const nodemailer = require("nodemailer");
const { findAllFormatter, findOneFormatter } = require('../utils/formatters/userFormatter');

const otpGenerator = (length = 6) => {
    // Generate a random number with the specified length
    const otp = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
    return otp;
};

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS_APP,
    },
  });
  
  transporter.verify((err, success) => {
    if (err) {
      console.log(err);
    } else {
      console.log("ready for messages");
      console.log(success);
    }
  });

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    
        const hashedPassword = await bcrypt.hash(password, 10);

        const userQuery = `
            INSERT INTO users (name, email, password, created_at, updated_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *;
        `;

        const otpQuery = `
            INSERT INTO verifyOtp (email, otp, created_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            RETURNING *;
        `;

        const userValues = [name, email, hashedPassword];
        const userResult = await pool.query(userQuery, userValues);
        
        const newUser = userResult.rows[0]; // Get the newly created user
        
        const otpValues = [newUser.email, otpGenerator()]; // Generate OTP for the user
        await pool.query(otpQuery, otpValues);
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your Email",
            html: `<p>Verify your email address to complete the register and login into your account. </p> <p>
            here is your otp <b>${otpValues[1]}</b> <b>expires in 1 hour </b>.`,
          };

        await transporter.sendMail(mailOptions);
        return res.status(201).json({ data: findOneFormatter(newUser) });
    
});
  

  exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    try {
        
        const query = `
            SELECT * FROM users WHERE email = $1;
        `;
        const result = await pool.query(query, [email]);

        const user = result.rows[0]; 

        if (!user) {
            return next(new ApiError('Incorrect email or password', 401));
        }

        if(!user.verified) {
            return next(new ApiError('Please verify your email', 401));
        }

        // Compare the hashed password with the provided password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return next(new ApiError('Incorrect email or password', 401));
        }

        // Create a token with user ID and role as payload
        const payload = { id: user.id, role: user.role };
        const token = createToken(payload);


        await updateLoginData(user.id);
        return res.status(200).json({ data: findOneFormatter(user), token });
    } catch (err) {
        console.error('Error during login', err.stack);
        res.status(500).json({ message: 'Server error' });
    }
  });

  exports.verifyOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;


        // Query to find the OTP record for the given user
        const query = `
            SELECT * FROM verifyOtp WHERE email = $1 AND otp = $2;
        `;
        const result = await pool.query(query, [email, otp]);

        const otpRecord = result.rows[0]; // Get the OTP record from the query result

        if (!otpRecord) {
            return next(new ApiError('Invalid OTP', 400));
        }

        // Optionally, you can check if the OTP is expired or already used here
        const otpCreationTime = new Date(otpRecord.created_at);
        const currentTime = new Date();
        const timeDifference = (currentTime - otpCreationTime) / (1000 * 60); // Difference in minutes

        if (timeDifference > 60) {
            return next(new ApiError('OTP has expired', 400));
        }
        // If OTP is valid, perform any actions you need, such as marking the user as verified
        const updateQuery = `
            UPDATE users
            SET verified = true, updated_at = CURRENT_TIMESTAMP
            WHERE email = $1
            RETURNING *;
        `;
        const updateResult = await pool.query(updateQuery, [email]);
        const updatedUser = updateResult.rows[0];

        // Delete the OTP record after verification
        await pool.query(`DELETE FROM verifyOtp WHERE email = $1`, [email]);

        return res.status(200).json({ message: 'OTP verified successfully', data: findOneFormatter(updatedUser) });

});

const updateLoginData = async (id) => {
    const query = `
        UPDATE users
        SET last_login = CURRENT_TIMESTAMP,
            number_of_logins = number_of_logins + 1
        WHERE id = $1
        RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    const updatedUser = result.rows[0];
    return updatedUser;
}
