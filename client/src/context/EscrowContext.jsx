import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const EscrowContext = createContext();

export const EscrowProvider = ({ children }) => {
  const [token, setToken] = useState({
    id: 'tok_esc_960',
    gig_id: 'gig_101',
    employer_id: 'emp_prf_001',
    worker_id: 'wrk_prf_001',
    token_hash: '0x9fa41c88c7b822ee40b90e15967dc21f456c7890abcdef1234567890abcdef12',
    amount: 960.00,
    status: 'Held', // 'Created' | 'Held' | 'Released'
    locked_at: new Date(Date.now() - 1800000).toISOString(),
    released_at: null,
    tx_hash: '0x4f128ab67cde8910fedcba98765432101234567890abcdef1234567890abcdef',
    payout_account_mask: 'UPI: ramesh.patil@okaxis'
  });

  const [shift, setShift] = useState({
    id: 'shf_001',
    gig_id: 'gig_101',
    worker_id: 'wrk_prf_001',
    escrow_token_id: 'tok_esc_960',
    punch_in_time: new Date(Date.now() - 1800000).toISOString(),
    punch_out_time: null,
    total_duration_minutes: 30,
    total_payout: 120.00,
    status: 'active'
  });

  const [activeGig, setActiveGig] = useState({
    id: 'gig_101',
    title: 'Urgent: Express Warehouse Parcel Dispatch & Stacking',
    category: 'Logistics & Warehousing',
    hourly_rate: 240.00,
    estimated_hours: 4.0,
    total_amount: 960.00,
    geo_lat: 19.0728,
    geo_lng: 72.8795
  });

  const [timer, setTimer] = useState({
    elapsedSeconds: 1800,
    elapsedFormatted: '00:30:00',
    accruedPayout: 120.00
  });

  const [auditLedger, setAuditLedger] = useState([
    {
      id: 'ledg_001',
      escrow_token_id: 'tok_esc_960',
      event_type: 'ESCROW_TOKEN_CREATED',
      previous_state: null,
      new_state: 'Created',
      amount: 960.00,
      signature: 'sig_ed25519_0x1122334455667788',
      metadata: { note: 'Employer funded INR 960.00 via Razorpay Virtual Escrow Vault' },
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'ledg_002',
      escrow_token_id: 'tok_esc_960',
      event_type: 'SHIFT_PUNCH_IN_HELD',
      previous_state: 'Created',
      new_state: 'Held',
      amount: 960.00,
      signature: 'sig_ed25519_0x9988776655443322',
      metadata: {
        note: 'Worker Ramesh punched in at 24.5m distance. Metro Token transitioned to HELD.',
        geo_verified: true
      },
      created_at: new Date(Date.now() - 1800000).toISOString()
    }
  ]);

  const [loading, setLoading] = useState(false);

  // Sync state from server on mount
  const fetchEscrowState = useCallback(async () => {
    try {
      const res = await fetch('/api/escrow/active');
      if (res.ok) {
        const data = await res.json();
        if (data.token) setToken(data.token);
        if (data.shift) setShift(data.shift);
        if (data.gig) setActiveGig(data.gig);
        if (data.timer) setTimer(data.timer);
        if (data.auditLedger) setAuditLedger(data.auditLedger);
      }
    } catch (e) {
      // Backend offline or fallback to active state
    }
  }, []);

  useEffect(() => {
    fetchEscrowState();
  }, [fetchEscrowState]);

  // Live client-side timer tick when shift is active
  useEffect(() => {
    if (token?.status !== 'Held' || shift?.status !== 'active') return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newSec = prev.elapsedSeconds + 1;
        const hrs = Math.floor(newSec / 3600).toString().padStart(2, '0');
        const mins = Math.floor((newSec % 3600) / 60).toString().padStart(2, '0');
        const secs = (newSec % 60).toString().padStart(2, '0');
        const hourlyRate = activeGig?.hourly_rate || 240;
        const accrued = parseFloat(((newSec / 3600) * hourlyRate).toFixed(2));

        return {
          elapsedSeconds: newSec,
          elapsedFormatted: `${hrs}:${mins}:${secs}`,
          accruedPayout: accrued
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [token?.status, shift?.status, activeGig?.hourly_rate]);

  // Punch In Handler: transitions Created -> Held
  const handlePunchIn = async (gigId, coords) => {
    setLoading(true);
    try {
      const res = await fetch('/api/escrow/punch-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gigId: gigId || token.gig_id,
          workerId: 'wrk_prf_001',
          lat: coords?.lat || 19.0729,
          lng: coords?.lng || 72.8794
        })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setShift(data.shift);
        if (data.timer) setTimer(data.timer);
        await fetchEscrowState();
      }
      return data;
    } catch (error) {
      // Direct optimistic state update
      const now = new Date().toISOString();
      setToken(prev => ({ ...prev, status: 'Held', locked_at: now }));
      setShift(prev => ({ ...prev, status: 'active', punch_in_time: now }));
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Punch Out Handler: transitions Held -> Released
  const handlePunchOut = async (shiftId, coords) => {
    setLoading(true);
    try {
      const res = await fetch('/api/escrow/punch-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId: shiftId || shift?.id,
          lat: coords?.lat || 19.0729,
          lng: coords?.lng || 72.8794
        })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setShift(data.shift);
        await fetchEscrowState();
      }
      return data;
    } catch (error) {
      const now = new Date().toISOString();
      setToken(prev => ({ ...prev, status: 'Released', released_at: now }));
      setShift(prev => ({ ...prev, status: 'completed', punch_out_time: now }));
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Reset to Created (for demonstration)
  const resetDemoEscrow = () => {
    setToken({
      id: `tok_esc_${Math.floor(100 + Math.random() * 900)}`,
      gig_id: 'gig_101',
      employer_id: 'emp_prf_001',
      worker_id: 'wrk_prf_001',
      token_hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      amount: 960.00,
      status: 'Created',
      locked_at: null,
      released_at: null,
      tx_hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      payout_account_mask: 'Escrow Vault Ready'
    });
    setShift({
      id: `shf_${Math.floor(100 + Math.random() * 900)}`,
      gig_id: 'gig_101',
      worker_id: 'wrk_prf_001',
      escrow_token_id: 'tok_esc_960',
      punch_in_time: null,
      punch_out_time: null,
      total_duration_minutes: 0,
      total_payout: 0,
      status: 'scheduled'
    });
    setTimer({
      elapsedSeconds: 0,
      elapsedFormatted: '00:00:00',
      accruedPayout: 0.00
    });
  };

  return (
    <EscrowContext.Provider value={{
      token,
      shift,
      activeGig,
      timer,
      auditLedger,
      loading,
      handlePunchIn,
      handlePunchOut,
      fetchEscrowState,
      resetDemoEscrow
    }}>
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrow = () => useContext(EscrowContext);
