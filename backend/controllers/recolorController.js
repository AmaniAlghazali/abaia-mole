const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadedCache = new Map();

const recolorProduct = async (req, res) => {
  try {
    const { imageUrl, targetHex } = req.body;

    if (!imageUrl || !targetHex) {
      return res.status(400).json({ error: 'Missing required fields: imageUrl, targetHex' });
    }

    // Convert localhost URL to local file path
    // e.g., http://localhost:5000/uploads/1780697737703.jpg → uploads/1780697737703.jpg
    const urlObj = new URL(imageUrl);
    const localPath = path.join(__dirname, '..', urlObj.pathname);

    let publicId;
    if (uploadedCache.has(imageUrl)) {
      publicId = uploadedCache.get(imageUrl);
    } else if (fs.existsSync(localPath)) {
      // Upload from local filesystem
      const uploadResult = await cloudinary.uploader.upload(localPath, {
        folder: 'abaia/recolor',
      });
      publicId = uploadResult.public_id;
      uploadedCache.set(imageUrl, publicId);
    } else {
      // Fallback: try fetching the URL (for remote images)
      const uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: 'abaia/recolor',
      });
      publicId = uploadResult.public_id;
      uploadedCache.set(imageUrl, publicId);
    }

    const cleanHex = targetHex.replace('#', '');

    // e_replace_color يستبدل اللون السائد في الصورة (العباية السوداء) بلون الهدف
    // sensitivity=50 يعطي توازناً جيداً بين استهداف القماش الأسود وحماية البشرة والشعر
    const recolorUrl = cloudinary.url(publicId, {
      transformation: [
        { effect: `replace_color:${cleanHex}:50` },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    res.json({ url: recolorUrl });
  } catch (error) {
    console.error('Cloudinary recolor error:', error);
    res.status(500).json({ error: error.message || 'AI recolor failed' });
  }
};

module.exports = { recolorProduct };