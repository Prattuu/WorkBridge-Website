import { db } from '../config/db.js';
import crypto from 'crypto';

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export const getHyperlocalGigs = async (req, res) => {
  try {
    const workerLat = parseFloat(req.query.lat) || 19.0760;
    const workerLng = parseFloat(req.query.lng) || 72.8777;
    const radiusLimit = parseFloat(req.query.radius) || 5.0; // 5 km geo-fence

    const gigsWithDistance = db.gigs.map(gig => {
      const distance = calculateHaversineDistance(workerLat, workerLng, gig.geo_lat, gig.geo_lng);
      const employer = db.employer_profiles.find(e => e.id === gig.employer_id);
      const escrowToken = db.escrow_tokens.find(t => t.gig_id === gig.id);

      return {
        ...gig,
        distance_km: distance,
        within_geofence: distance <= (gig.geo_radius_km || radiusLimit),
        employer_name: employer ? employer.company_name : 'Local Enterprise',
        escrow_status: escrowToken ? escrowToken.status : 'None',
        escrow_amount: escrowToken ? escrowToken.amount : gig.total_amount
      };
    });

    // Return all gigs sorted by distance, with geofence indicator
    const sortedGigs = gigsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    return res.json({
      success: true,
      worker_location: { lat: workerLat, lng: workerLng },
      geo_fence_radius_km: radiusLimit,
      count: sortedGigs.length,
      gigs: sortedGigs
    });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createGig = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      hourly_rate,
      estimated_hours,
      geo_lat,
      geo_lng,
      geo_radius_km
    } = req.body;

    if (!title || !hourly_rate || !estimated_hours) {
      return res.status(400).json({ success: false, message: 'Title, hourly rate, and estimated hours are required.' });
    }

    const employer = db.employer_profiles[0];
    const gigId = `gig_${Date.now().toString().slice(-4)}`;
    const totalAmount = parseFloat((Number(hourly_rate) * Number(estimated_hours)).toFixed(2));

    const newGig = {
      id: gigId,
      employer_id: employer.id,
      title,
      description: description || 'Hyperlocal on-demand shift with instant escrow settlement.',
      category: category || 'General Logistics',
      hourly_rate: Number(hourly_rate),
      estimated_hours: Number(estimated_hours),
      total_amount: totalAmount,
      geo_lat: Number(geo_lat) || employer.geo_lat,
      geo_lng: Number(geo_lng) || employer.geo_lng,
      geo_radius_km: Number(geo_radius_km) || 5.0,
      matched_worker_id: null,
      status: 'open',
      created_at: new Date().toISOString()
    };

    db.gigs.unshift(newGig);

    // Automatically create single-token escrow in "Created" state
    const tokenHash = '0x' + crypto.createHash('sha256').update(`${gigId}-${employer.id}-${Date.now()}`).digest('hex');
    const escrowToken = {
      id: `tok_esc_${Date.now().toString().slice(-4)}`,
      gig_id: gigId,
      employer_id: employer.id,
      worker_id: null,
      token_hash: tokenHash,
      amount: totalAmount,
      status: 'Created', // Created -> Held -> Released
      locked_at: null,
      released_at: null,
      refunded_at: null,
      tx_hash: '0x' + crypto.randomBytes(32).toString('hex'),
      payout_account_mask: 'Escrow Vault Lock',
      created_at: new Date().toISOString()
    };

    db.escrow_tokens.push(escrowToken);

    // Append to audit ledger
    db.audit_ledger.push({
      id: `ledg_${Date.now().toString().slice(-4)}`,
      escrow_token_id: escrowToken.id,
      event_type: 'ESCROW_TOKEN_CREATED',
      previous_state: null,
      new_state: 'Created',
      amount: totalAmount,
      initiated_by_user_id: employer.user_id,
      signature: 'sig_ed25519_' + crypto.randomBytes(16).toString('hex'),
      metadata: {
        note: `Escrow token created for gig: ${title}`,
        geo_fence: `${newGig.geo_radius_km} km`
      },
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Gig published and Metro Escrow Token created.',
      gig: newGig,
      escrowToken
    });
  } catch (error) {
    console.error('Error creating gig:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const applyAndMatchGig = async (req, res) => {
  try {
    const { gigId, workerProfileId } = req.body;
    const gig = db.gigs.find(g => g.id === gigId);

    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found.' });
    }

    const worker = db.worker_profiles.find(w => w.id === (workerProfileId || 'wrk_prf_001'));
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker profile not found.' });
    }

    gig.matched_worker_id = worker.id;
    gig.status = 'matched';

    // Update escrow token
    const token = db.escrow_tokens.find(t => t.gig_id === gig.id);
    if (token) {
      token.worker_id = worker.id;
    }

    // Provision Privacy Shield Masking Session
    const proxyNumber = `+91 22 6900 ${Math.floor(1000 + Math.random() * 9000)}`;
    const sessionToken = `wb_mask_sess_${crypto.randomBytes(8).toString('hex')}`;
    const maskSession = {
      id: `cms_${Date.now().toString().slice(-4)}`,
      gig_id: gig.id,
      employer_id: gig.employer_id,
      worker_id: worker.user_id,
      virtual_proxy_number: proxyNumber,
      session_token: sessionToken,
      expires_at: new Date(Date.now() + 24 * 3600000).toISOString(),
      is_active: true,
      call_count: 0,
      messages_count: 0
    };
    db.contact_mask_sessions.push(maskSession);

    return res.json({
      success: true,
      message: 'Worker matched! Privacy Shield proxy line provisioned.',
      gig,
      maskSession
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPresignedS3Url = async (req, res) => {
  try {
    const { fileType, uploadType } = req.body; // 'kyc' or 'pitch'
    const fileId = crypto.randomBytes(12).toString('hex');
    const extension = fileType === 'video' ? 'webm' : 'jpg';
    const key = `uploads/${uploadType || 'documents'}/${fileId}.${extension}`;

    // Simulated AWS S3 Presigned PUT URL
    const presignedUrl = `https://workbridge-storage-vault.s3.ap-south-1.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20261030%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261030T100000Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=${crypto.randomBytes(32).toString('hex')}`;

    return res.json({
      success: true,
      uploadUrl: presignedUrl,
      fileKey: key,
      publicUrl: `https://workbridge-storage-vault.s3.ap-south-1.amazonaws.com/${key}`,
      expiresInSeconds: 900
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getContactMaskSession = async (req, res) => {
  try {
    const { gigId } = req.params;
    let session = db.contact_mask_sessions.find(s => s.gig_id === gigId);

    if (!session) {
      session = {
        id: `cms_${Date.now().toString().slice(-4)}`,
        gig_id: gigId,
        employer_id: 'usr_emp_001',
        worker_id: 'usr_wrk_001',
        virtual_proxy_number: '+91 22 6900 4589',
        session_token: `wb_mask_sess_${crypto.randomBytes(8).toString('hex')}`,
        expires_at: new Date(Date.now() + 24 * 3600000).toISOString(),
        is_active: true,
        call_count: 1,
        messages_count: 3
      };
      db.contact_mask_sessions.push(session);
    }

    return res.json({
      success: true,
      session
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
