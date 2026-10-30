"""
WorkBridge Automated Verification - Mock OCR Engine
Simulates Optical Character Recognition (OCR) for Aadhaar and Voter ID cards,
including bounding box extraction, regex identity parsing, and tamper risk analysis.
"""

import re
import random
from typing import Dict, Any, List

class MockOCREngine:
    def __init__(self):
        self.supported_documents = ["aadhaar", "voter_id", "pan"]

    def extract_document_data(self, document_type: str = "aadhaar", image_base64: str = None) -> Dict[str, Any]:
        doc_type_clean = (document_type or "aadhaar").lower()

        if "voter" in doc_type_clean:
            return self._parse_voter_id()
        else:
            return self._parse_aadhaar()

    def _parse_aadhaar(self) -> Dict[str, Any]:
        # Generate realistic Aadhaar fields
        uid = f"{random.randint(2000, 9999)} {random.randint(1000, 9999)} {random.randint(1000, 9999)}"
        name = "RAMESH DNYANESHWAR PATIL"
        dob = "14/05/1992"
        gender = "MALE"
        address = "Plot 42, Kurla West Commercial Hub, Mumbai 400070"

        bounding_boxes = [
            {"label": "GOVT_EMBLEM", "box": [35, 20, 90, 80], "confidence": 0.998},
            {"label": "NAME", "box": [115, 45, 335, 75], "confidence": 0.987, "text": name},
            {"label": "DOB", "box": [115, 82, 255, 108], "confidence": 0.991, "text": dob},
            {"label": "GENDER", "box": [115, 115, 210, 140], "confidence": 0.982, "text": gender},
            {"label": "AADHAAR_NUMBER", "box": [95, 205, 410, 240], "confidence": 0.994, "text": uid},
            {"label": "SECURE_QR_CODE", "box": [320, 50, 440, 170], "confidence": 0.995}
        ]

        return {
            "document_type": "Government of India - Aadhaar (UIDAI)",
            "is_valid": True,
            "extracted_fields": {
                "id_number": uid,
                "full_name": name,
                "dob": dob,
                "gender": gender,
                "address": address
            },
            "bounding_boxes": bounding_boxes,
            "security_analysis": {
                "tamper_detected": False,
                "tamper_score": 0.012,
                "hologram_verified": True,
                "microtext_pattern": "PASS",
                "overall_confidence_percentage": 98.6
            }
        }

    def _parse_voter_id(self) -> Dict[str, Any]:
        epic_no = f"MH/04/{random.randint(100, 999)}/{random.randint(10000, 99999)}"
        name = "SUNITA RADHESHYAM SHARMA"
        dob = "20/11/1995"
        gender = "FEMALE"
        father_name = "Radheshyam Sharma"

        bounding_boxes = [
            {"label": "ELECTION_COMMISSION_HEADER", "box": [40, 15, 420, 50], "confidence": 0.995},
            {"label": "EPIC_NUMBER", "box": [50, 60, 240, 90], "confidence": 0.989, "text": epic_no},
            {"label": "ELECTOR_NAME", "box": [130, 100, 380, 130], "confidence": 0.982, "text": name},
            {"label": "FATHER_NAME", "box": [130, 140, 360, 168], "confidence": 0.978, "text": father_name},
            {"label": "DOB_AGE", "box": [130, 178, 260, 204], "confidence": 0.985, "text": dob}
        ]

        return {
            "document_type": "Election Commission of India - Voter ID",
            "is_valid": True,
            "extracted_fields": {
                "id_number": epic_no,
                "full_name": name,
                "father_name": father_name,
                "dob": dob,
                "gender": gender
            },
            "bounding_boxes": bounding_boxes,
            "security_analysis": {
                "tamper_detected": False,
                "tamper_score": 0.019,
                "hologram_verified": True,
                "microtext_pattern": "PASS",
                "overall_confidence_percentage": 96.8
            }
        }

ocr_engine = MockOCREngine()
