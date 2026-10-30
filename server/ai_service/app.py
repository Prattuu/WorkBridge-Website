"""
WorkBridge Python AI Microservice
Automated KYC OCR Parsing & 30-Second Video Pitch NLP Analyzer
"""

import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from utils.ocr_engine import ocr_engine
from utils.pitch_analyzer import pitch_analyzer

try:
    from fastapi import FastAPI, Request
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False

if FASTAPI_AVAILABLE:
    app = FastAPI(title="WorkBridge AI Verification Engine", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class OCRRequest(BaseModel):
        documentType: str = "aadhaar"
        documentBase64: str = ""

    class PitchRequest(BaseModel):
        audioTranscript: str = ""
        videoDurationSeconds: int = 28
        candidateName: str = "Candidate"

    @app.get("/api/ai/health")
    def health_check():
        return {
            "status": "ONLINE",
            "service": "WorkBridge AI Verification Engine (FastAPI)",
            "capabilities": ["OCR_DOCUMENT_PARSING", "SPEECH_NLP_ANALYSIS"]
        }

    @app.post("/api/ai/ocr")
    def run_ocr(payload: OCRRequest):
        res = ocr_engine.extract_document_data(
            document_type=payload.documentType,
            image_base64=payload.documentBase64
        )
        return {"success": True, **res}

    @app.post("/api/ai/pitch-analysis")
    def run_pitch_analysis(payload: PitchRequest):
        res = pitch_analyzer.analyze_pitch(
            transcript=payload.audioTranscript,
            duration_seconds=payload.videoDurationSeconds,
            candidateName=payload.candidateName
        )
        return {"success": True, **res}

# Universal HTTP Fallback Server (runs natively in Python with zero pip dependencies)
class UniversalAIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path == '/api/ai/health':
            self._set_headers(200)
            res = {
                "status": "ONLINE",
                "service": "WorkBridge AI Verification Engine (Python Microservice)",
                "capabilities": ["OCR_DOCUMENT_PARSING", "SPEECH_NLP_ANALYSIS"]
            }
            self.wfile.write(json.dumps(res).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        body = json.loads(post_data) if post_data else {}

        if self.path == '/api/ai/ocr':
            res = ocr_engine.extract_document_data(
                document_type=body.get('documentType', 'aadhaar'),
                image_base64=body.get('documentBase64')
            )
            self._set_headers(200)
            self.wfile.write(json.dumps({"success": True, **res}).encode('utf-8'))

        elif self.path == '/api/ai/pitch-analysis':
            res = pitch_analyzer.analyze_pitch(
                transcript=body.get('audioTranscript', ''),
                duration_seconds=body.get('videoDurationSeconds', 28),
                candidate_name=body.get('candidateName', 'Candidate')
            )
            self._set_headers(200)
            self.wfile.write(json.dumps({"success": True, **res}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run_server(port=8000):
    if FASTAPI_AVAILABLE and '--fastapi' in sys.argv:
        import uvicorn
        print(f"Starting FastAPI AI Service on port {port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)
    else:
        server_address = ('0.0.0.0', port)
        httpd = HTTPServer(server_address, UniversalAIHandler)
        print(f"=======================================================")
        print(f"🧠 WorkBridge Python AI Microservice running on port {port}")
        print(f"🔍 Mock OCR Engine & Speech NLP Analyzer: READY")
        print(f"=======================================================")
        httpd.serve_forever()

if __name__ == '__main__':
    run_server(8000)
