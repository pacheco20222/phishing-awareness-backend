const bcrypt = require('bcryptjs');
const User = require('../models/User');
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 2FA secret
        const secret = speakeasy.generateSecret({ name: `PhishingAwareness(${email})` });

        // Create new user document
        const newUser = new User({
            name,
            second_name,
            last_name,
            second_lastname,
            email,
            password: hashedPassword,
            phone_number,
            country,
            job,
            two_factor_secret: secret.base32,
            two_factor_enabled: true
        });

        await newUser.save();

        // Generate QR code for 2FA app
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

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check 2FA
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
                id: user._id,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

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


// Updating a user
const updateUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        const updateData = req.body;

        const updateUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updateUser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({
            msg: 'User updated successfully',
            user: updateUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Deleting a user
const deleteUser = async (req, res) => {
    try {
        
        const { id } =  req.params;
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({
            msg: 'User deleted successfully',
            user: deleteUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = {
    signupUser,
    loginUser,
    getProfile,
    updateUser,
    deleteUser
};
