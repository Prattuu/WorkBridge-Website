import express from 'express';
import {
  createEscrowToken,
  punchIn,
  punchOut,
  getActiveEscrowState,
  getAuditLedger
} from '../controllers/escrowController.js';

const router = express.Router();

router.post('/create-token', createEscrowToken);
router.post('/punch-in', punchIn);
router.post('/punch-out', punchOut);
router.get('/active', getActiveEscrowState);
router.get('/ledger/:tokenId?', getAuditLedger);

export default router;
