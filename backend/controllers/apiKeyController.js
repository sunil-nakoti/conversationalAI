const ApiKey = require('../models/ApiKey');
const { encrypt, decrypt } = require('../utils/cryptoUtils');

// @desc    Get all API key names and descriptions (values are excluded for security)
// @route   GET /api/keys
// @access  Private (Admin only)
exports.getApiKeys = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ success: false, msg: 'Not authorized' });
    }
    try {
        const keys = await ApiKey.find().select('-value');
        res.status(200).json({ success: true, data: keys });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Create or update an API key
// @route   POST /api/keys
// @access  Private (Admin only)
exports.saveApiKey = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ success: false, msg: 'Not authorized' });
    }
    try {
        const { key, value, description } = req.body;
        if (!key || !value) {
            return res.status(400).json({ success: false, msg: 'Key and value are required' });
        }

        const encryptedValue = encrypt(value);

        const apiKey = await ApiKey.findOneAndUpdate(
            { key },
            { value: encryptedValue, description },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: { key: apiKey.key } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Delete an API key
// @route   DELETE /api/keys/:key
// @access  Private (Admin only)
exports.deleteApiKey = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ success: false, msg: 'Not authorized' });
    }
    try {
        const apiKey = await ApiKey.findOne({ key: req.params.key });
        if (!apiKey) {
            return res.status(404).json({ success: false, msg: 'API Key not found' });
        }

        await apiKey.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// Internal function to get a decrypted key for use in other services
exports.getDecryptedKey = async (key) => {
    try {
        const apiKey = await ApiKey.findOne({ key });
        if (!apiKey) {
            console.warn(`API Key "${key}" not found in database.`);
            return null;
        }
        return decrypt(apiKey.value);
    } catch (error) {
        console.error(`Failed to decrypt key "${key}":`, error);
        return null;
    }
};
