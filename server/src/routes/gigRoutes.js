import express from 'express';
import {
  getHyperlocalGigs,
  createGig,
  applyAndMatchGig,
  getPresignedS3Url,
  getContactMaskSession
} from '../controllers/gigController.js';

const router = express.Router();

router.get('/hyperlocal', getHyperlocalGigs);
router.post('/create', createGig);
router.post('/apply', applyAndMatchGig);
router.post('/s3-presigned-url', getPresignedS3Url);
router.get('/mask-session/:gigId', getContactMaskSession);

export default router;
