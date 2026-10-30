import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    brand_name: 'WorkBridge',
    tagline: 'Hyperlocal Gig Workforce within 5 km',
    subtagline: 'On-demand informal & semi-skilled workforce with single-token dynamic escrow and instant settlement.',
    nav_home: 'Home',
    nav_employer: 'Employer Portal',
    nav_worker: 'Worker Portal',
    nav_roles: 'Switch Role',
    nav_architecture: 'Architecture & Cloud Spec',
    hero_cta_hire: 'Hire Gig Partner',
    hero_cta_work: 'Find Gigs Near Me',
    badge_geofence: '5 km Dynamic Geofence Active',
    badge_escrow: 'Single-Token Metro Escrow',
    badge_ai: 'AI-Powered OCR & Pitch Verification',
    badge_privacy: 'Privacy Shield Contact Masking',
    escrow_title: 'Metro-Token Financial Escrow',
    escrow_desc: 'Funds transition strictly from Created → Held upon punch-in, and auto-disburse to Released upon punch-out.',
    state_created: 'CREATED',
    state_held: 'HELD (Funds Locked)',
    state_released: 'RELEASED (Instant Disbursal)',
    state_created_desc: 'Employer budget locked in virtual escrow vault before shift starts.',
    state_held_desc: 'Worker punched in within 5 km. Funds strictly locked during active work.',
    state_released_desc: 'Punch-out verified. Funds transferred immediately via instant UPI rail.',
    punch_in_btn: 'Punch In (Lock Escrow)',
    punch_out_btn: 'Punch Out (Disburse Escrow)',
    shift_timer: 'Live Shift Timer',
    accrued_payout: 'Accrued Payout',
    hourly_rate: 'Hourly Rate',
    hours_worked: 'Hours Worked',
    privacy_shield: 'Privacy Shield Proxy',
    privacy_desc: 'Your real phone number is masked. Calls and messages route through a dedicated virtual bridge line.',
    virtual_number: 'Virtual Proxy Line',
    voice_assistant: 'Voice Guidance Assistant',
    voice_listening: 'Voice guidance is active. Click to hear instructions.',
    voice_play: 'Read Page Aloud',
    voice_stop: 'Stop Audio',
    kyc_title: 'Automated AI Identity Verification',
    kyc_ocr: 'Mock OCR Document Scan',
    kyc_pitch: '30-Second Video Pitch NLP',
    kyc_verified: 'Verified Gig Partner',
    kyc_score: 'AI Reliability Score',
    post_gig_title: 'Post Hyperlocal Gig',
    gig_title: 'Shift Title',
    gig_category: 'Category',
    gig_hours: 'Estimated Hours',
    gig_rate: 'Rate per Hour (₹)',
    gig_publish: 'Fund Escrow & Post Gig',
    open_gigs_near_you: 'Gigs Within 5 km Radius',
    distance_away: 'away',
    apply_now: 'Accept Shift & Generate QR',
    status_active: 'Active Shift in Progress',
    status_completed: 'Shift Settled & Paid',
    audit_trail: 'Tamper-Evident Escrow Audit Ledger',
    view_details: 'View Details'
  },
  hi: {
    brand_name: 'वर्कब्रिज (WorkBridge)',
    tagline: '5 किमी के दायरे में हाइपरलोकल कार्यबल',
    subtagline: 'सिंगल-टोकन डायनेमिक एस्क्रो और तत्काल भुगतान के साथ ऑन-डिमांड अर्ध-कुशल गिग पार्टनर्स।',
    nav_home: 'होम',
    nav_employer: 'नियोक्ता पोर्टल (Employer)',
    nav_worker: 'श्रमिक पोर्टल (Worker)',
    nav_roles: 'भूमिका बदलें',
    nav_architecture: 'क्लाउड आर्किटेक्चर',
    hero_cta_hire: 'कामगार खोजें',
    hero_cta_work: 'पास के काम देखें',
    badge_geofence: '5 किमी जियोफेंस सक्रिय',
    badge_escrow: 'मेट्रो-टोकन एस्क्रो प्रणाली',
    badge_ai: 'एआई ओसीआर एवं वीडियो सत्यापन',
    badge_privacy: 'गोपनीयता शील्ड (नंबर मास्किंग)',
    escrow_title: 'मेट्रो-टोकन वित्तीय एस्क्रो',
    escrow_desc: 'पंच-इन पर फंड Created → Held में लॉक होता है और पंच-आउट पर तुरंत Released होकर खाते में पहुंचता है।',
    state_created: 'निर्मित (CREATED)',
    state_held: 'सुरक्षित लॉक्ड (HELD)',
    state_released: 'तुरंत जारी (RELEASED)',
    state_created_desc: 'शिफ्ट शुरू होने से पहले नियोक्ता का बजट डिजिटल वॉलेट में लॉक हो गया।',
    state_held_desc: 'कामगार ने 5 किमी दायरे में पंच-इन किया। कार्य के दौरान फंड पूरी तरह सुरक्षित है।',
    state_released_desc: 'पंच-आउट सत्यापित। यूपीआई के जरिए पैसे तुरंत कामगार के खाते में भेजे गए।',
    punch_in_btn: 'पंच इन करें (फंड लॉक)',
    punch_out_btn: 'पंच आउट करें (पैसे जारी)',
    shift_timer: 'लाइव शिफ्ट टाइमर',
    accrued_payout: 'कुल अर्जित कमाई',
    hourly_rate: 'प्रति घंटा दर',
    hours_worked: 'काम के घंटे',
    privacy_shield: 'प्राइवेसी शील्ड प्रॉक्सी',
    privacy_desc: 'आपका असली फोन नंबर छिपा रहता है। सभी कॉल और संदेश वर्चुअल प्रॉक्सी लाइन से गुजरते हैं।',
    virtual_number: 'वर्चुअल प्रॉक्सी नंबर',
    voice_assistant: 'आवाज़ सहायता (Voice Assistant)',
    voice_listening: 'ध्वनि मार्गदर्शन सक्रिय है। पृष्ठ सुनने के लिए क्लिक करें।',
    voice_play: 'पेज पढ़कर सुनाएं',
    voice_stop: 'ध्वनि रोकें',
    kyc_title: 'स्वचालित एआई पहचान सत्यापन',
    kyc_ocr: 'मॉक ओसीआर दस्तावेज़ जांच',
    kyc_pitch: '30-सेकंड वीडियो पिच विश्लेषण',
    kyc_verified: 'सत्यापित गिग पार्टनर',
    kyc_score: 'एआई विश्वसनीयता स्कोर',
    post_gig_title: 'नया काम पोस्ट करें',
    gig_title: 'काम का नाम',
    gig_category: 'श्रेणी',
    gig_hours: 'अनुमानित घंटे',
    gig_rate: 'प्रति घंटा दर (₹)',
    gig_publish: 'एस्क्रो फंड लॉक करें व पोस्ट करें',
    open_gigs_near_you: '5 किमी के दायरे में उपलब्ध काम',
    distance_away: 'दूरी पर',
    apply_now: 'काम स्वीकार करें (क्यूआर कोड)',
    status_active: 'सक्रिय शिफ्ट जारी है',
    status_completed: 'शिफ्ट संपन्न एवं भुगतान सफल',
    audit_trail: 'अपरिवर्तनीय एस्क्रो ऑडिट लेज़र',
    view_details: 'विवरण देखें'
  },
  mr: {
    brand_name: 'वर्कब्रिज (WorkBridge)',
    tagline: '५ किमी परिसरात त्वरित स्थानिक कामगार',
    subtagline: 'सिंगल-टोकन डायनॅमिक एस्क्रो आणि झटपट खात्यात जमा रकमेसह विश्वासू गिग कर्मचारी.',
    nav_home: 'मुख्यपृष्ठ',
    nav_employer: 'नियोक्ता पोर्टल (Employer)',
    nav_worker: 'कामगार पोर्टल (Worker)',
    nav_roles: 'भूमिका निवडा',
    nav_architecture: 'क्लाउड आर्किटेक्चर',
    hero_cta_hire: 'कामगार शोधा',
    hero_cta_work: 'माझ्याजवळचे काम शोधा',
    badge_geofence: '५ किमी जिओफेन्स कार्यरत',
    badge_escrow: 'मेट्रो-टोकन एस्क्रो व्यवस्था',
    badge_ai: 'एआय ओसीआर व ऑडिओ पडताळणी',
    badge_privacy: 'प्रायव्हसी शील्ड (फोन नंबर सुरक्षा)',
    escrow_title: 'मेट्रो-टोकन आर्थिक एस्क्रो',
    escrow_desc: 'पंच-इन केल्यावर निधी Created → Held मध्ये सुरक्षित होतो आणि पंच-आउट होताच Released होऊन खात्यात जमा होतो.',
    state_created: 'तयार (CREATED)',
    state_held: 'सुरक्षित लॉक (HELD)',
    state_released: 'खात्यात वर्ग (RELEASED)',
    state_created_desc: 'शिफ्ट सुरू होण्यापूर्वी मालकाची रक्कम सुरक्षित एस्क्रो खात्यात जमा झाली.',
    state_held_desc: 'कामगाराने ५ किमी परिसरात पंच-इन केले. काम संपेपर्यंत निधी सुरक्षित लॉक आहे.',
    state_released_desc: 'पंच-आउट पूर्ण. यूपीआयद्वारे पैसे तत्काळ कामगाराच्या बँक खात्यात जमा झाले.',
    punch_in_btn: 'पंच इन करा (निधी लॉक करा)',
    punch_out_btn: 'पंच आउट करा (पैसे मिळवा)',
    shift_timer: 'थेट शिफ्ट घड्याळ (Timer)',
    accrued_payout: 'मिळालेली कमाई',
    hourly_rate: 'ताशी दर',
    hours_worked: 'कामाचे तास',
    privacy_shield: 'प्रायव्हसी शील्ड प्रॉक्सी',
    privacy_desc: 'तुमचा मूळ फोन नंबर उघड केला जात नाही. संपर्क थेट सुरक्षित व्हर्च्युअल नंबरद्वारे होतो.',
    virtual_number: 'व्हर्च्युअल प्रॉक्सी नंबर',
    voice_assistant: 'आवाज सहाय्यक (Voice Assistant)',
    voice_listening: 'आवाज मार्गदर्शन उपलब्ध आहे. माहिती ऐकण्यासाठी क्लिक करा.',
    voice_play: 'माहिती ऐका',
    voice_stop: 'आवाज बंद करा',
    kyc_title: 'स्वयंचलित एआय ओळख पडताळणी',
    kyc_ocr: 'मॉक ओसीआर दस्तऐवज तपासणी',
    kyc_pitch: '३० सेकंद व्हिडिओ पिच विश्लेषण',
    kyc_verified: 'पडताळणी झालेले कामगार',
    kyc_score: 'विश्वसनीयता गुणांक',
    post_gig_title: 'नवीन काम नोंदवा',
    gig_title: 'कामाचे नाव',
    gig_category: 'प्रवर्ग',
    gig_hours: 'अपेक्षित तास',
    gig_rate: 'ताशी मानधन (₹)',
    gig_publish: 'एस्क्रो रक्कम सुरक्षित करून काम द्या',
    open_gigs_near_you: '५ किमी परिसरातील उपलब्ध कामे',
    distance_away: 'अंतरावर',
    apply_now: 'काम स्वीकारा (क्यूआर कोड)',
    status_active: 'काम चालू आहे',
    status_completed: 'काम पूर्ण आणि पैसे जमा',
    audit_trail: 'पारदर्शक एस्क्रो ऑडिट लेजर',
    view_details: 'तपशील पहा'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('wb_language') || 'en';
  });

  const setLanguage = (lang) => {
    if (['en', 'hi', 'mr'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('wb_language', lang);
      // Notify backend if user is authenticated
      fetch('/api/auth/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
      }).catch(() => {});
    }
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
