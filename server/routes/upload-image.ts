import { Router } from 'express';
import { storagePut } from '../storage.js';
import { randomBytes } from 'crypto';
import { sdk } from '../_core/sdk.js';

const router = Router();

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

router.post('/upload-image', async (req, res) => {
  try {
    // Authenticate: require admin
    const user = await sdk.authenticateRequest(req);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { image, filename } = req.body;

    if (!image || !filename) {
      return res.status(400).json({ error: 'Missing image or filename' });
    }

    // Validate file extension
    const ext = (filename.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return res.status(400).json({ error: 'File type not allowed' });
    }

    // Extract base64 data and content type
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }

    // Generate unique filename
    const randomSuffix = randomBytes(8).toString('hex');
    const key = `blog-images/${Date.now()}-${randomSuffix}.${ext}`;

    // Upload to S3
    const { url } = await storagePut(key, buffer, contentType);

    res.json({ url });
  } catch (error: any) {
    console.error('Image upload error:', error);
    // Don't leak internal error details
    if (error?.statusCode === 403 || error?.message?.includes('Forbidden') || error?.message?.includes('session')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
