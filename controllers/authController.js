const bcrypt = require('bcryptjs');
const db = require('../config/db');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');

// Controller function to handle user signup
const signupUser = async (req, res) => {
    try {
        const {
            name,
            second_name,
            last_name,
            second_lastname,
            email,
            password,
            phone_number,
            country,
            job
        } = req.body;

        // Check if user already exists
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 2FA secret
        const secret = speakeasy.generateSecret({ name: `PhishingAwareness(${email})` });

        // Insert new user into database with 2FA secret
        await db.promise().query(
            'INSERT INTO users (name, second_name, last_name, second_lastname, email, password, phone_number, country, job, two_factor_secret, two_factor_enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, second_name, last_name, second_lastname, email, hashedPassword, phone_number, country, job, secret.base32, true]
        );

        // Generate QR code for 2FA app (like Google Authenticator)
        const otpauth_url = secret.otpauth_url;
        const qrCodeDataURL = await qrcode.toDataURL(otpauth_url);

        res.status(201).json({
            msg: 'User registered successfully',
            qr: qrCodeDataURL
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, token } = req.body;

        // Check if user exists
        const [userRows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const user = userRows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if 2FA is enabled and verify token
        if (user.two_factor_enabled) {
            const verified = speakeasy.totp.verify({
                secret: user.two_factor_secret,
                encoding: 'base32',
                token: token
            });

            if (!verified) {
                return res.status(401).json({ msg: 'Invalid 2FA token' });
            }
        }

        // Generate JWT token
        const tokenJWT = jwt.sign(
            { 
                id: user.id, email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response with token
        res.status(200).json({
            msg: 'Login successful',
            token: tokenJWT,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const getProfile = (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            msg: 'Profile fetched successfully',
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch profile' });
    }
};

module.exports = {
    signupUser,
    loginUser,
    getProfile
};
