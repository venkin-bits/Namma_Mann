Project Workflow – Namma Mann (Hybrid AI Pest Advisory System)
1️⃣ Frontend Layer (User Interaction)
Folder: frontend/, index.html, vite.config.js, tailwind.config.js, postcss.config.js
Built a lightweight web interface using Vite + Tailwind CSS
Farmers capture or upload leaf images through the UI
Ensured:
Fast load time
Mobile-friendly design for rural usability
Frontend sends images to backend via API calls
2️⃣ Backend Orchestration Layer (Decision Controller)
Folder: src/, requirements.txt, .env.example
Backend acts as the central decision engine
Responsibilities:
Receive image from frontend
Route image through ML pipeline
Apply confidence-based decision logic
Environment variables managed securely using .env
3️⃣ ML Inference Pipeline (Hybrid Brain)
Folder: ml/
Step 1: Pest Localization
Used YOLOv8-Nano for object detection
Identifies where the pest exists on the leaf
Optimized for:
Low latency
Edge-device compatibility
Step 2: Pest Classification
Cropped pest region passed to XGBoost (ONNX)
Classifies pest types like:
Stem Borer
Aphids
Other crop-specific pests
4️⃣ Confidence Gate & Safety Logic
Implemented inside backend (src + ml integration)
Introduced a 70% confidence threshold
Workflow:
≥ 70% confidence: AI-generated diagnosis shown
< 70% confidence: Switch to rule-based fallback
Prevents incorrect AI advice due to limited training time
5️⃣ Rule-Based Fallback System (TNAU + ITK)
Data-driven logic layer
Uses Tamil Nadu Agricultural University (TNAU) verified data
Suggests Indigenous Technical Knowledge (ITK) remedies:
Neem oil (நீமெண்ணெய்)
Chili–garlic paste
Sticky traps
Guarantees:
Scientifically backed
Soil-safe recommendations
6️⃣ Deployment & Scalability
Folder: deploy/
Structured for cloud deployment
Designed for:
Horizontal scaling
Multi-village data aggregation
Enables future features like:
Pest heat maps
Community alerts
Carbon credit tracking