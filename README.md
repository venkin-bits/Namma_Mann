The Vision: Namma Mann (Our Soil)

Namma Mann is an AI-powered ITK (Indigenous Technical Knowledge) implementation engine designed to bridge the gap between traditional agricultural wisdom and modern scientific validation. For decades, farmers in the Coimbatore region have shifted toward chemical pesticides because they offer "standardized" and "fast" results, whereas traditional methods are often perceived as "variable" or "unproven." Namma Mann changes this narrative by digitizing local knowledge and backing it with scientific data to provide farmers with a reliable, cost-effective, and soil-friendly alternative.

The Core Problem and Scientific Guardrails
The primary challenge in promoting traditional methods is avoiding "blind promotion." We cannot suggest a remedy simply because it is old; it must be effective. Namma Mann solves this by acting as a Validation Layer. The engine only recommends practices that have been cross-referenced with scientific databases from institutions like Tamil Nadu Agricultural University (TNAU) and the Indian Council of Agricultural Research (ICAR). Every recommendation includes a "Scientific Rationale." For instance, if the app suggests a Neem-based spray, it explains the role of Azadirachtin in disrupting pest lifecycles. This ensures that the farmer isn't following a myth, but rather a biological solution.

How the "Hack" Works :

The platform operates through a seamless digital workflow. It begins with Vision AI, where a farmer takes a photo of a pest—such as the Stem Weevil or Rice Earhead Bug. Using a Convolutional Neural Network (CNN) specifically trained on pests common to the red and black soils of the Coimbatore/Pollachi belt, the AI identifies the threat instantly.
Once identified, the engine performs Local Knowledge Mapping. Instead of suggesting a commercial chemical, it looks at the farmer’s "fence-side" resources. By using the phone's GPS, the AI identifies what flora is likely available in that specific micro-climate—such as Notchi leaves, Calotropis, or Neem. It then provides a "Digital Recipe" for a bio-pesticide that can be made for free using those specific plants.

The Confidence & Savings Model :

To overcome the "slow" perception of organic methods, the system uses a Predictive Model to provide immediate psychological and financial incentives. When a recipe is suggested, the AI calculates a "Confidence Score" and a "Future Impact Forecast." It shows the farmer that while a chemical might work in 24 hours, this traditional mix will increase their soil’s organic carbon and cation exchange capacity by a specific percentage over the next month. Most importantly, it displays a real-time financial comparison, showing exactly how many thousands of rupees the farmer is saving on urea and synthetic inputs by using the resources already available on their land.
Accessibility through Localization
Recognizing that many farmers prefer familiar interfaces, Namma Mann is designed as a WhatsApp-first solution. By using an SMS or WhatsApp gateway, farmers can send their pest photos and receive instructions via Tamil Voice Notes. This removes the barrier of complex app navigation and puts a "Digital Agricultural Scientist" in their pocket. By focusing on the specific soil characteristics of Coimbatore—leveraging the high water retention of black soil and the drainage properties of red soil—the advice is never generic; it is always hyper-local, scientifically validated, and economically empowering

 Farmer Photo → react-webcam → base64
         ↓
FastAPI /analyze-image endpoint
         ↓  
YOLOv8 Soil Patch Detection
         ↓
XGBoost-ONNX Pest Classification  
         ↓
"Stem Borer 87% confidence → Neem oil + Sticky traps"
         ↓
✅ Tamil recommendations


ML is trained under this below data sets to identify pest and damaged crop

since 3 data sets required alot of training load it takes total of 7 hours to train 50 epoch(number of iterations and single iterations contains more than 3000 images)

Dataset 1: Pest Dataset V2
 Name: Pest Dataset V2
Content: 16 pest classes (Aphids, Weevils, Beetles, etc.)
Link: https://www.kaggle.com/datasets/ibrahimagabardiop/pestaidatasetv2

Dataset 2: Crop Pest Dataset
Name: Crop Pest Dataset
Content: Specific rice pests, including Stem Borer, Green Leafhopper, Rice Bug, and Leaf Roller.
Link: https://www.kaggle.com/datasets/pialghosh/crop-pest-dataset

Dataset 3: New Plant Diseases Dataset
Name: New Plant Diseases Dataset (Augmented)      Content: 87,900 images covering 38 unique classes of healthy and diseased crop leaves (based on the original PlantVillage dataset).

Link: https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset

traditional method 
TNAU Agritech Portal 
link: https://agritech.tnau.ac.in/itk/IndigenousTechKnowledge_Crop_Rice.html folling this at bottom preparation page link is provided 

TNAU / Govt of TN
link: http://www.agritech.tnau.ac.in/org_farm/orgfarm_pestanddisease.html

our main features is to make this project reach local farmers and make it cost free agriculture so we find WhatsApp to be Main feature but whatsapp required buisness account and payment is not been used