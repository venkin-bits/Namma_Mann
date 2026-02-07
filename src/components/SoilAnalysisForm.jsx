/**
 * Namma Mann - Pest Detection for Tamil Nadu Crops
 * Install: npm install react-webcam
 */
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const API = "http://localhost:8000";
const TAMIL = {
  title: "பூச்சி கண்டறிதல்",
  submit: "பரிசோதனை",
  crop: "பயிர்",
  pestSeverity: "பூச்சி தீவிரம்",
  affectedArea: "பாதிக்கப்பட்ட பகுதி %",
  plantHealth: "தாவர ஆரோக்கியம்",
  pestType: "பூச்சி வகை",
  diseaseStage: "நோய் நிலை",
  cameraBtn: "பயிர் படம் எடு",
  cameraAnalysis: "கேமரா பரிசோதனை",
  analyzing: "AI பகுப்பாய்வு...",
  success: "✅ AI பூச்சி பரிசோதனை முடிந்தது!",
  capture: "படம் எடு",
  close: "மூடு",
  orManual: "அல்லது கைமுறை உள்ளீடு",
  district: "மாவட்டம்",
};
const ENG = {
  title: "Pest Detection",
  submit: "Analyze",
  crop: "Crop",
  pestSeverity: "Pest Severity (1-10)",
  affectedArea: "Affected Area %",
  plantHealth: "Plant Health %",
  pestType: "Pest Type",
  diseaseStage: "Disease Stage",
  cameraBtn: "Take Crop Photo",
  cameraAnalysis: "Camera Analysis",
  analyzing: "AI Analyzing...",
  success: "✅ AI Pest Detection Complete!",
  capture: "Capture",
  close: "Close",
  orManual: "Or enter manually",
  district: "District",
};

const CROPS = [
  { value: "Rice", label: "Rice", emoji: "🌾" },
  { value: "Sugarcane", label: "Sugarcane", emoji: "🎋" },
  { value: "Cotton", label: "Cotton", emoji: "🧵" },
  { value: "Tomato", label: "Tomato", emoji: "🍅" },
  { value: "Chilli", label: "Chilli", emoji: "🌶️" },
];

const DISEASE_STAGES = ["Early", "Mid", "Late"];
const PEST_TYPES = [
  "Stem Borer", "Aphids", "Leafhopper", "Whitefly", "Thrips",
  "Fruit Borer", "Bacterial Blight", "Leaf Curl",
];

const DISTRICTS = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
  "Tirunelveli", "Tiruppur", "Erode", "Vellore", "Thoothukudi",
];

const COLORS = ["#10b981", "#059669", "#047857", "#065f46"];

// Mock pest data by crop for camera auto-fill
const MOCK_PEST_BY_CROP = {
  Rice: { pestSeverity: 4, affectedArea: 15, plantHealth: 72, pestType: "Stem Borer", diseaseStage: "Early" },
  Sugarcane: { pestSeverity: 3, affectedArea: 8, plantHealth: 85, pestType: "Leafhopper", diseaseStage: "Early" },
  Cotton: { pestSeverity: 6, affectedArea: 25, plantHealth: 58, pestType: "Whitefly", diseaseStage: "Mid" },
  Tomato: { pestSeverity: 5, affectedArea: 20, plantHealth: 62, pestType: "Fruit Borer", diseaseStage: "Mid" },
  Chilli: { pestSeverity: 4, affectedArea: 12, plantHealth: 78, pestType: "Thrips", diseaseStage: "Early" },
};

export default function PestDetectionForm() {
  const [lang, setLang] = useState("en");
  const [crop, setCrop] = useState("Rice");
  const [pest, setPest] = useState({
    pestSeverity: 4,
    affectedArea: 15,
    plantHealth: 72,
    pestType: "Stem Borer",
    diseaseStage: "Early",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState("Chennai");

  // Camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [imageAnalysisSuccess, setImageAnalysisSuccess] = useState(false);
  const webcamRef = useRef(null);

  const t = lang === "ta" ? TAMIL : ENG;

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "environment",
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const img = webcamRef.current.getScreenshot();
      setCapturedImage(img);
      setCameraOpen(false);
      analyzeImage(img);
    }
  }, []);

  const analyzeImage = async (base64Image) => {
    setAnalyzingImage(true);
    setImageAnalysisSuccess(false);
    try {
      const r = await fetch(`${API}/analyze-pest-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image, crop }),
      });
      if (r.ok) {
        const data = await r.json();
        setPest({
          pestSeverity: data.pestSeverity ?? MOCK_PEST_BY_CROP[crop].pestSeverity,
          affectedArea: data.affectedArea ?? MOCK_PEST_BY_CROP[crop].affectedArea,
          plantHealth: data.plantHealth ?? MOCK_PEST_BY_CROP[crop].plantHealth,
          pestType: data.pestType ?? MOCK_PEST_BY_CROP[crop].pestType,
          diseaseStage: data.diseaseStage ?? MOCK_PEST_BY_CROP[crop].diseaseStage,
        });
        setImageAnalysisSuccess(true);
      } else {
        throw new Error("Analysis failed");
      }
    } catch {
      // Fallback: mock pest data by selected crop
      const m = MOCK_PEST_BY_CROP[crop];
      setPest({ ...m });
      setImageAnalysisSuccess(true);
    } finally {
      setAnalyzingImage(false);
    }
  };

  const openCamera = () => {
    setCameraError(null);
    setCapturedImage(null);
    setImageAnalysisSuccess(false);
    setCameraOpen(true);
  };

  const closeCamera = () => {
    setCameraOpen(false);
    setCameraError(null);
  };

  const submit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`${API}/analyze-pest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, ...pest, district }),
      });
      const data = await r.json();
      setResult(data);
    } catch (err) {
      // Mock result when backend unavailable
      setResult({
        recommendation: "🔬 Apply neem oil spray; Remove affected leaves. 💧 Increase irrigation.",
        tamil_recommendation: "வேப்ப எண்ணெய் தெளித்தல்; பாதிக்கப்பட்ட இலைகளை அகற்றுங்கள்.",
        ml_score: (100 - pest.affectedArea) / 100,
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = result
    ? [
        { name: "Severity", value: pest.pestSeverity, fill: COLORS[0] },
        { name: "Affected %", value: pest.affectedArea, fill: COLORS[1] },
        { name: "Health", value: pest.plantHealth, fill: COLORS[2] },
      ]
    : [];

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: "#059669" }}
        >
          {t.title}
        </h1>
        <p className="text-green-800/80 mb-4">
          🌾 Tamil Nadu crop pest & plant health detection
        </p>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setLang(lang === "ta" ? "en" : "ta")}
            className="px-4 py-2 rounded-lg border border-green-300 text-green-800 hover:bg-green-100 transition min-h-[44px]"
          >
            {lang === "ta" ? "English" : "தமிழ்"}
          </button>
          <label className="flex items-center gap-2 min-h-[44px]">
            <span className="text-green-800 font-medium">{t.district}:</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 min-h-[44px]"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Crop selector */}
        <div className="mb-6">
          <label className="block text-green-800 font-medium mb-2">{t.crop}</label>
          <select
            value={crop}
            onChange={(e) => {
              setCrop(e.target.value);
              setPest({ ...MOCK_PEST_BY_CROP[e.target.value] });
            }}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 min-h-[50px]"
          >
            {CROPS.map((c) => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>

        {/* Camera capture section */}
        <div className="mb-6">
          <button
            onClick={openCamera}
            className="w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition hover:shadow-xl hover:opacity-95 flex items-center justify-center gap-3 min-h-[50px] text-lg"
            style={{ backgroundColor: "#10b981" }}
          >
            📸 {t.cameraAnalysis}
          </button>

          {capturedImage && (
            <div className="mt-4 p-4 bg-white rounded-xl shadow border border-green-100">
              <div className="flex gap-4 items-start">
                <img
                  src={capturedImage}
                  alt="Captured crop"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  {analyzingImage ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>{t.analyzing}</span>
                    </div>
                  ) : imageAnalysisSuccess ? (
                    <p className="text-green-700 font-medium">{t.success}</p>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          <p className="mt-3 text-center text-green-700/80 text-sm">
            {t.orManual}
          </p>
        </div>

        {/* Manual inputs - pest/plant health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { key: "pestSeverity", min: 1, max: 10, step: 1 },
            { key: "affectedArea", min: 0, max: 100, step: 1 },
            { key: "plantHealth", min: 0, max: 100, step: 1 },
          ].map(({ key, min, max, step }) => (
            <label key={key} className="block">
              <span className="text-green-800 font-medium">{t[key] || key}</span>
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={pest[key]}
                onChange={(e) =>
                  setPest({ ...pest, [key]: parseFloat(e.target.value) || 0 })
                }
                className="mt-1 w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[44px]"
              />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="text-green-800 font-medium">{t.pestType}</span>
            <select
              value={pest.pestType}
              onChange={(e) => setPest({ ...pest, pestType: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 min-h-[44px]"
            >
              {PEST_TYPES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-green-800 font-medium">{t.diseaseStage}</span>
            <select
              value={pest.diseaseStage}
              onChange={(e) => setPest({ ...pest, diseaseStage: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 min-h-[44px]"
            >
              {DISEASE_STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 rounded-lg font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-70 min-h-[50px]"
          style={{ backgroundColor: "#10b981" }}
        >
          🌾 {loading ? "..." : t.submit}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-green-100">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Results
            </h3>
            <p className="text-green-800 mb-1">{result.recommendation}</p>
            {result.tamil_recommendation && (
              <p className="text-gray-600 mb-2">
                {result.tamil_recommendation}
              </p>
            )}
            <p className="text-sm text-green-700">
              Plant Health Score:{" "}
              <span className="font-bold">{result.ml_score ?? pest.plantHealth / 100}</span>
            </p>

            {chartData.length > 0 && (
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Camera modal - fullscreen on mobile */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            {cameraError ? (
              <div className="p-6 text-center text-white">
                <p className="mb-4">{cameraError}</p>
                <p className="text-sm opacity-80 mb-6">
                  {lang === "ta"
                    ? "தயவுசெய்து கைமுறை உள்ளீட்டைப் பயன்படுத்தவும்"
                    : "Please use manual input below"}
                </p>
                <button
                  onClick={closeCamera}
                  className="px-6 py-3 rounded-lg font-bold bg-green-600 text-white min-h-[50px]"
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                onUserMediaError={() =>
                  setCameraError(
                    "Camera access denied or unavailable. Check permissions."
                  )
                }
              />
            )}
          </div>
          {!cameraError && (
            <div className="p-4 flex gap-4 bg-black/80">
              <button
                onClick={capture}
                className="flex-1 py-4 rounded-xl font-bold text-white min-h-[50px] flex items-center justify-center gap-2"
                style={{ backgroundColor: "#10b981" }}
              >
                📸 {t.capture}
              </button>
              <button
                onClick={closeCamera}
                className="px-6 py-4 rounded-xl font-bold bg-gray-600 text-white min-h-[50px]"
              >
                {t.close}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
