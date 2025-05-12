const bcrypt = require('bcryptjs');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const encryptionKey = crypto.createHash('sha256').update(String(process.env.TWO_FA_ENCRYPTION_KEY)).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16);

const encryptSecret = (secret) => {
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

const decryptSecret = (encryptedSecret) => {
    const [ivHex, encrypted] = encryptedSecret.split(':');
    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

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
            two_factor_secret: encryptSecret(secret.base32),
            two_factor_enabled: true
        });

        await newUser.save();

        // Generate QR code for 2FA app
        const otpauth_url = secret.otpauth_url;
        const qrCodeDataURL = await qrcode.toDataURL(otpauth_url);

        // TODO: Encrypt the 2FA secret before saving it in production environments
        res.status(201).json({
            msg: 'User registered successfully',
            qr: qrCodeDataURL,
            two_factor_secret: secret.base32, // for use in Authenticator manually
            otpauth_url: otpauth_url          // for backup use in generating QR or OTPs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, twoFactorToken } = req.body;

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
                secret: decryptSecret(user.two_factor_secret),
                encoding: 'base32',
                token: twoFactorToken
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

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -two_factor_secret');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

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
        const allowedFields = ['email', 'phone_number', 'country', 'job'];
        const updateData = {};

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

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
        const { id } = req.params;
        if (req.user.id !== id) {
            return res.status(403).json({ msg: 'Unauthorized to delete this user' });
        }
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
