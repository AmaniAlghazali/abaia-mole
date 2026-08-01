const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadedCache = new Map();

const recolorProduct = async (req, res) => {
  try {
    const { imageUrl, targetHex, prompt } = req.body;

    if (!imageUrl || !targetHex) {
      return res.status(400).json({ error: 'Missing required fields: imageUrl, targetHex' });
    }

    // Ensure the image has a stable Cloudinary public_id so we can apply
    // transformations to it. Local uploads are pushed to Cloudinary once and
    // then cached so subsequent recolor requests skip the upload step.
    const urlObj = new URL(imageUrl);
    const localPath = path.join(__dirname, '..', urlObj.pathname);

    let publicId;
    if (uploadedCache.has(imageUrl)) {
      publicId = uploadedCache.get(imageUrl);
    } else if (fs.existsSync(localPath)) {
      const uploadResult = await cloudinary.uploader.upload(localPath, { folder: 'abaia/recolor' });
      publicId = uploadResult.public_id;
      uploadedCache.set(imageUrl, publicId);
    } else {
      const uploadResult = await cloudinary.uploader.upload(imageUrl, { folder: 'abaia/recolor' });
      publicId = uploadResult.public_id;
      uploadedCache.set(imageUrl, publicId);
    }

    const cleanTo = targetHex.replace('#', '');

    // gen_recolor uses Cloudinary's generative AI to semantically identify the
    // garment in the image and synthesize the new colour from scratch.
    // This works correctly on pure black / near-zero luminance fabrics where
    // replace_color has no effect because it can only blend existing colour data.
    //
    // Resize to 900px wide BEFORE the AI step — the model runs on far fewer
    // pixels and finishes in ~20–30s instead of minutes on the original size.
    // The output is still sharp enough for any product display context.
    const recolorPrompt = prompt || 'the black abaya dress fabric';
    const recolorUrl = cloudinary.url(publicId, {
      secure: true,
      transformation: [
        { width: 900, crop: 'limit' },
        { effect: `gen_recolor:prompt_${recolorPrompt};to-color_${cleanTo}` },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    res.json({ url: recolorUrl });
  } catch (error) {
    console.error('Cloudinary recolor error:', error);
    res.status(500).json({ error: error.message || 'Recolor failed' });
  }
};

module.exports = { recolorProduct };
