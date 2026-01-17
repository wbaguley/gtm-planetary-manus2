import { Router } from 'express';
import { storagePut } from '../storage.js';
import { randomBytes } from 'crypto';

const router = Router();

router.post('/upload-image', async (req, res) => {
  try {
    const { image, filename } = req.body;

    if (!image || !filename) {
      return res.status(400).json({ error: 'Missing image or filename' });
    }

    // Extract base64 data and content type
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const ext = filename.split('.').pop();
    const randomSuffix = randomBytes(8).toString('hex');
    const key = `blog-images/${Date.now()}-${randomSuffix}.${ext}`;

    // Upload to S3
    const { url } = await storagePut(key, buffer, contentType);

    res.json({ url });
  } catch (error: any) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

export default router;
