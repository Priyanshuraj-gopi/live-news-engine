import { Story, Genre, LanguageCode, Region } from "@/types";

export const GENRE_PALETTES: Record<Genre, string[]> = {
  sports: ["#0284c7", "#38bdf8", "#0369a1", "#0c4a6e"],
  politics: ["#b91c1c", "#ef4444", "#7f1d1d", "#450a0a"],
  markets: ["#059669", "#10b981", "#047857", "#064e3b"],
  weather: ["#0284c7", "#06b6d4", "#22d3ee", "#155e75"],
  tech: ["#6366f1", "#818cf8", "#4338ca", "#312e81"],
  entertainment: ["#d946ef", "#ec4899", "#a21caf", "#701a75"],
  crime: ["#475569", "#64748b", "#334155", "#0f172a"],
  health: ["#14b8a6", "#2dd4bf", "#0f766e", "#134e4a"],
};

export const GENRE_DOMINANT: Record<Genre, string> = {
  sports: "#0369a1",
  politics: "#991b1b",
  markets: "#065f46",
  weather: "#0e7490",
  tech: "#4338ca",
  entertainment: "#86198f",
  crime: "#334155",
  health: "#115e59",
};

interface StorySeedDef {
  id: string;
  genre: Genre;
  originalLanguage: LanguageCode;
  region: Region;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  authorName: string;
  authorRole: "editor" | "contributor" | "admin";
  velocityScore: number;
  publishedHoursAgo: number;
  translations: Record<
    LanguageCode,
    {
      headline: string;
      summary: string;
      takeaways: string[];
      fullArticle: string;
    }
  >;
  motionSpec: {
    topic: string;
    mood: "urgent" | "celebratory" | "analytical" | "grave" | "inspiring" | "dynamic";
  };
}

// 64 realistic rich stories covering 8 genres, 7 languages, Indian regions
export const RAW_STORIES_DEFINITIONS: StorySeedDef[] = [
  // -------------------------------------------------
  // 1. TECH
  // -------------------------------------------------
  {
    id: "tech-isro-quantum-satellite",
    genre: "tech",
    originalLanguage: "en",
    region: { country: "India", state: "Karnataka", city: "Bengaluru" },
    imageUrl: "https://images.unsplash.com/photo-1517976487502-550bb3b37805?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Technology Bureau",
    sourceUrl: "https://zeenews.india.com/tech",
    authorName: "Vikram Rathore",
    authorRole: "editor",
    velocityScore: 94,
    publishedHoursAgo: 2,
    motionSpec: { topic: "ISRO Quantum Satellite", mood: "inspiring" },
    translations: {
      en: {
        headline: "ISRO Achieves Breakthrough Quantum Key Entanglement via Satellite Link",
        summary:
          "In a monumental milestone for national cybersecurity, the Indian Space Research Organisation has successfully demonstrated free-space quantum key distribution across a 1,200 km orbital satellite link from Bengaluru, paving the way for unhackable quantum communications across India.",
        takeaways: [
          "Demonstrated 1,200 km satellite quantum key distribution with zero packet loss.",
          "Completely indigenous optical payload developed in collaboration with Bengaluru laboratories.",
          "Will secure sovereign defense communications and core banking networks by 2027.",
        ],
        fullArticle:
          "The Indian Space Research Organisation (ISRO) achieved a decisive breakthrough in secure communications early Tuesday. Scientists successfully transmitted entangled photons between an experimental satellite and a ground station situated on the outskirts of Bengaluru.\n\nQuantum Key Distribution (QKD) leverages the fundamental principles of quantum mechanics to generate cryptographic keys that are mathematically invulnerable to eavesdropping or quantum decryption. According to mission leads, the demonstration verified key rates capable of supporting high-frequency financial ledgers and defense encrypted links.",
      },
      hi: {
        headline: "इसरो ने उपग्रह लिंक के माध्यम से क्वांटम कुंजी संचार में रचा नया इतिहास",
        summary:
          "भारतीय अंतरिक्ष अनुसंधान संगठन ने बेंगलुरु से 1,200 किलोमीटर की दूरी पर अंतरिक्ष-आधारित क्वांटम कुंजी वितरण का सफल परीक्षण किया है, जिससे देश में अभेद्य संचार तकनीक का मार्ग प्रशस्त हुआ है।",
        takeaways: [
          "1,200 किमी दूरी पर शून्य डेटा हानि के साथ क्वांटम संचार का सफल प्रदर्शन।",
          "बेंगलुरु की प्रयोगशालाओं के सहयोग से पूर्णतः स्वदेशी पेलोड तैयार किया गया।",
          "2027 तक रक्षा एवं बैंकिंग नेटवर्क को क्वांटम सुरक्षा प्रदान की जाएगी।",
        ],
        fullArticle:
          "भारतीय अंतरिक्ष अनुसंधान संगठन (इसरो) ने मंगलवार को सुरक्षित संचार के क्षेत्र में एक ऐतिहासिक छलांग लगाई। वैज्ञानिकों ने एक प्रायोगिक उपग्रह और बेंगलुरु के निकट स्थित ग्राउंड स्टेशन के बीच उलझे हुए फोटॉनों का सफलतापूर्वक आदान-प्रदान किया।",
      },
      kn: {
        headline: "ಇಸ್ರೋ ಉಪಗ್ರಹ ಮೂಲಕ ಕ್ವಾಂಟಮ್ ಸಂವಹನದಲ್ಲಿ ಐತಿಹಾಸಿಕ ಮೈಲಿಗಲ್ಲು",
        summary:
          "ಬೆಂಗಳೂರಿನಿಂದ 1,200 ಕಿ.ಮೀ ದೂರದ ಉಪಗ್ರಹ ಲಿಂಕ್ ಮೂಲಕ ಕ್ವಾಂಟಮ್ ಕೀ ವಿತರಣೆಯನ್ನು ಇಸ್ರೋ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರದರ್ಶಿಸಿದ್ದು, ಭಾರತದಲ್ಲಿ ಅನ್ಹ್ಯಾಕ್ ಮಾಡಲಾಗದ ಸಂಪರ್ಕ ವ್ಯವಸ್ಥೆಗೆ ನಾಂದಿ ಹಾಡಿದೆ.",
        takeaways: [
          "1,200 ಕಿಮೀ ದೂರದ ಉಪಗ್ರಹ ಕ್ವಾಂಟಮ್ ವಿತರಣೆ ಯಶಸ್ವಿ.",
          "ಬೆಂಗಳೂರು ಪ್ರಯೋಗಾಲಯಗಳ ಸಹಯೋಗದೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಸ್ವದೇಶಿ ತಂತ್ರಜ್ಞಾನ.",
          "ರಕ್ಷಣಾ ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್ ಕ್ಷೇತ್ರಗಳಿಗೆ ಅಭೇದ್ಯ ಭದ್ರತೆ.",
        ],
        fullArticle: "ಭಾರತೀಯ ಬಾಹ್ಯಾಕಾಶ ಸಂಶೋಧನಾ ಸಂಸ್ಥೆ (ಇಸ್ರೋ) ಸುರಕ್ಷಿತ ಸಂವಹನದಲ್ಲಿ ಮಹತ್ವದ ಮೈಲಿಗಲ್ಲು ಸಾಧಿಸಿದೆ.",
      },
      ta: {
        headline: "இஸ்ரோ செயற்கைக்கோள் மூலம் குவாண்டம் தகவல் தொடர்பில் இமாலய சாதனை",
        summary:
          "பெங்களூருவில் உள்ள தரை நிலையத்துடன் 1,200 கி.மீ தூர செயற்கைக்கோள் குவாண்டம் இணைப்பை வெற்றிகரமாக சோதித்து இஸ்ரோ சாதனை படைத்துள்ளது.",
        takeaways: [
          "1,200 கி.மீ தொலைவில் குவாண்டம் சாவிகள் பரிமாற்றம் வெற்றி.",
          "முழுக்க முழுக்க இந்தியாவில் தயாரிக்கப்பட்ட உள்நாட்டு தொழில்நுட்பம்.",
          "2027க்குள் ராணுவ மற்றும் வங்கி அமைப்புகளுக்கு முழு பாதுகாப்பு.",
        ],
        fullArticle: "இந்திய விண்வெளி ஆராய்ச்சி நிறுவனம் (இஸ்ரோ) குவாண்டம் பாதுகாப்பில் மிகப்பெரிய சாதனையை நிகழ்த்தியுள்ளது.",
      },
      te: {
        headline: "ఉపగ్రహం ద్వారా క్వాంటం కీ పంపిణీలో ఇస్రో సరికొత్త చరిత్ర",
        summary:
          "బెంగళూరు నుండి 1,200 కిలోమీటర్ల కక్ష్య ఉపగ్రహ లింక్ ద్వారా క్వాంటం కీ పంపిణీని ఇస్రో విజయవంతంగా ప్రదర్శించింది.",
        takeaways: [
          "1,200 కి.మీ దూరంలో క్వాంటం కమ్యూనికేషన్ విజయవంతం.",
          "స్వదేశీ పరిజ్ఞానంతో రూపొందించిన ప్రత్యేక పేలోడ్.",
          "భారత రక్షణ, బ్యాంకింగ్ రంగానికి అభేద్యమైన రక్షణ.",
        ],
        fullArticle: "భారత అంతరిక్ష పరిశోధన సంస్థ (ఇస్రో) సరికొత్త రక్షణ సాంకేతికతలో ముందడుగు వేసింది.",
      },
      mr: {
        headline: "इस्रोची क्वांटम उपग्रह संप्रेषणात ऐतिहासिक झेप",
        summary:
          "भारतीय अंतराळ संशोधन संस्थेने बंगळुरूमधून १,२०० किमी अंतरावर उपग्रहाद्वारे क्वांटम की वितरणाची यशस्वी चाचणी घेतली आहे.",
        takeaways: [
          "१,२०० किमी कक्षेत क्वांटम डेटाचे बिनचूक वितरण.",
          "पूर्णपणे स्वदेशी तंत्रज्ञानावर आधारित ऑप्टिकल पेलोड.",
          "देशाच्या संरक्षण आणि बँकिंग क्षेत्राला अभेद्य सुरक्षा मिळणार.",
        ],
        fullArticle: "भारतीय अंतराळ संशोधन संस्था (इस्रो) ने मंगळवारी अत्यंत सुरक्षित क्वांटम संप्रेषणात यश संपादन केले.",
      },
      bn: {
        headline: "কোয়ান্টাম স্যাটেলাইট প্রযুক্তিতে ইসরোর যুগান্তকারী সাফল্য",
        summary:
          "বেঙ্গালুরু থেকে ১,২০০ কিমি কক্ষপথ উপগ্রহ লিঙ্কের মাধ্যমে কোয়ান্টাম যোগাযোগ সফলভাবে প্রদর্শন করল ভারতীয় মহাকাশ গবেষণা সংস্থা।",
        takeaways: [
          "১,২০০ কিমি দূরত্বে সফল কোয়ান্টাম কী আদানপ্রদান।",
          "সম্পূর্ণ দেশীয় প্রযুক্তিতে তৈরি অপটিক্যাল পেলোড।",
          "প্রতিরক্ষা এবং ব্যাংকিং নেটওয়ার্কে হ্যাকিং-রোধী সুরক্ষা নিশ্চিত।",
        ],
        fullArticle: "ভারতীয় মহাকাশ গবেষণা সংস্থা ইসরো নিরাপদ যোগাযোগের ক্ষেত্রে এক ঐতিহাসিক মাইলফলক অর্জন করেছে।",
      },
    },
  },
  {
    id: "tech-semiconductor-fabs-gujarat",
    genre: "tech",
    originalLanguage: "en",
    region: { country: "India", state: "Gujarat", city: "Ahmedabad" },
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Business Tech",
    sourceUrl: "https://zeenews.india.com/markets",
    authorName: "Ananya Deshmukh",
    authorRole: "contributor",
    velocityScore: 88,
    publishedHoursAgo: 5,
    motionSpec: { topic: "Semiconductor Mega Fab", mood: "analytical" },
    translations: {
      en: {
        headline: "India's First 28nm Commercial Semiconductor Fab Commences Trial Silicon Runs in Dholera",
        summary:
          "Commercial silicon processing has officially begun at the multi-billion dollar Dholera semiconductor fabrication plant, producing pilot wafers destined for automotive controllers and 5G telecommunication gear across Asian markets.",
        takeaways: [
          "Initial trial runs yield operational 28nm microchips with 91% wafer purity.",
          "Anchor clients include Indian EV manufacturers and telecom network providers.",
          "Second phase expansion to integrate 14nm node processing by late 2026.",
        ],
        fullArticle:
          "The ambitious Indian Semiconductor Mission reached operational reality on Monday as the cleanrooms in Dholera, Gujarat initiated pilot silicon wafer etching.",
      },
      hi: {
        headline: "धोलेरा में भारत के पहले सेमीकंडक्टर फैब का ट्रायल रन शुरू",
        summary:
          "गुजरात के धोलेरा में बहुप्रतीक्षित 28nm वाणिज्यिक सेमीकंडक्टर फैब ने सिलिकॉन वेफर्स का उत्पादन परीक्षण सफलतापूर्वक शुरू कर दिया है।",
        takeaways: [
          "28nm माइक्रोचिप्स का पहला बैच 91% शुद्धता के साथ तैयार।",
          "प्रमुख ग्राहकों में घरेलू इलेक्ट्रिक वाहन और 5G उपकरण निर्माता शामिल।",
          "2026 के अंत तक 14nm नोड का विस्तार करने की योजना।",
        ],
        fullArticle: "गुजरात के धोलेरा स्थित सेमीकंडक्टर संयंत्र में व्यावसायिक उत्पादन का पहला चरण शुरू हो गया है।",
      },
      kn: {
        headline: "ಗುಜರಾತ್ ಧೋಲೇರಾದಲ್ಲಿ ಭಾರತದ ಮೊದಲ ಸೆಮಿಕಂಡಕ್ಟರ್ ಫ್ಯಾಬ್ ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆ ಆರಂಭ",
        summary: "ಭಾರತದ ಮೊದಲ ಸೆಮಿಕಂಡಕ್ಟರ್ ಕಾರ್ಖಾನೆಯು ಧೋಲೇರಾದಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಸಿಲಿಕಾನ್ ಚಿಪ್ ಪ್ರಾಯೋಗಿಕ ತಯಾರಿಕೆ ಆರಂಭಿಸಿದೆ.",
        takeaways: ["28nm ಮೈಕ್ರೋಚಿಪ್‌ಗಳ ಮೊದಲ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿ.", "ವಾಹನ ಮತ್ತು ಟೆಲಿಕಾಂ ಉಪಕರಣಗಳಿಗೆ ಪೂರೈಕೆ."],
        fullArticle: "ಭಾರತದ ಸೆಮಿಕಂಡಕ್ಟರ್ ಮಿಷನ್ ಯೋಜನೆಯು ಹೊಸ ಹಂತ ತಲುಪಿದೆ.",
      },
      ta: {
        headline: "தோலேராவில் இந்தியாவின் முதல் குறைக்கடத்தி ஆலை சோதனை ஓட்டம் தொடங்கியது",
        summary: "குஜராத்தில் உள்ள அதிநவீன ஆலையில் வணிக ரீதியிலான 28nm மைக்ரோசிப் சோதனை உற்பத்தி அதிகாரப்பூர்வமாக தொடங்கியுள்ளது.",
        takeaways: ["28nm மைக்ரோசிப்கள் சோதனை உற்பத்தி வெற்றி.", "வாகனங்கள் மற்றும் 5G அமைப்புகளுக்கு பயன்படும்."],
        fullArticle: "இந்தியாவின் செமிகண்டக்டர் கனவு நனவாகி வருகிறது.",
      },
      te: {
        headline: "ధోలేరాలో భారతదేశపు తొలి సెమీకండక్టర్ ఫ్యాబ్ ట్రయల్ రన్ ప్రారంభం",
        summary: "గుజరాత్‌లోని ధోలేరాలో 28nm మైక్రోచిప్స్ ఉత్పత్తి కోసం సిలికాన్ వేఫర్ ట్రయల్ రన్ విజయవంతంగా ప్రారంభమైంది.",
        takeaways: ["28nm చిప్స్ మొదటి దశ ట్రయల్ రన్ పూర్తి.", "ఆటోమొబైల్ మరియు టెలికాం పరికరాలకు సరఫరా."],
        fullArticle: "భారతీయ సెమీకండక్టర్ తయారీ రంగంలో నూతన అధ్యాయం మొదలైంది.",
      },
      mr: {
        headline: "धोलेरा येथे भारताच्या पहिल्या सेमीकंडक्टर प्रकल्पाची चाचणी सुरू",
        summary: "धोलेरा, गुजरात येथील सेमीकंडक्टर प्रकल्पातून पहिल्या २८nm सिलिकॉन चिप्सची चाचणी यशस्वीरीत्या सुरू झाली आहे.",
        takeaways: ["२८nm मायक्रोचिप्सचे उत्पादन सुरू.", "ईव्ही आणि ५जी क्षेत्राला मोठा फायदा."],
        fullArticle: "भारताच्या इलेक्ट्रॉनिक्स उत्पादन क्षेत्राने एक मोठे पाऊल पुढे टाकले आहे.",
      },
      bn: {
        headline: "ধোলেরায় ভারতের প্রথম সেমিকন্ডাক্টর মেগা প্ল্যান্টে ট্রায়াল রান শুরু",
        summary: "গুজরাটের ধোলেরায় বহু প্রতীক্ষিত ২৮ ন্যানোমিটার বাণিজ্যিক সেমিকন্ডাক্টর ফ্যাব পাইলট সিলিকন ওয়েফার তৈরি শুরু করেছে।",
        takeaways: ["২৮এনএম চিপসের সফল পাইলট উৎপাদন।", "টেলিকম ও ইভি সেক্টরে ব্যবহার বৃদ্ধি পাবে।"],
        fullArticle: "ভারতে নিজস্ব চিপ তৈরির পথে এক বিশাল অগ্রযাত্রা সূচিত হলো।",
      },
    },
  },
  // -------------------------------------------------
  // 2. MARKETS & ECONOMY
  // -------------------------------------------------
  {
    id: "markets-rbi-repo-rate-rupee-surge",
    genre: "markets",
    originalLanguage: "en",
    region: { country: "India", state: "Maharashtra", city: "Mumbai" },
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Business Mumbai",
    sourceUrl: "https://zeenews.india.com/markets",
    authorName: "Kavita Krishnamurthy",
    authorRole: "editor",
    velocityScore: 91,
    publishedHoursAgo: 3,
    motionSpec: { topic: "RBI Monetary Policy", mood: "analytical" },
    translations: {
      en: {
        headline: "RBI MPC Holds Repo Rate at 6.5%, Forecasts Robust 7.4% GDP Growth for FY26",
        summary:
          "The Reserve Bank of India Monetary Policy Committee has unanimously retained the benchmark policy repo rate at 6.50% while upgrading India's full-year GDP growth forecast to 7.4%, triggering an immediate rally in the Sensex above 84,000 points.",
        takeaways: [
          "Monetary Policy Committee voted 6-0 to maintain status quo on repo rates.",
          "Retail CPI inflation projected to settle comfortably within the 4.1% band.",
          "Sensex jumped 540 points led by private banking and capital goods equities.",
        ],
        fullArticle:
          "Delivering the bi-monthly monetary policy statement from Mint Street in Mumbai, Governor Shaktikanta Das affirmed that domestic macroeconomic fundamentals remain resilient amid global headwinds.",
      },
      hi: {
        headline: "आरबीआई ने रेपो दर 6.5% पर बरकरार रखी, जीडीपी विकास दर 7.4% रहने का अनुमान",
        summary:
          "भारतीय रिज़र्व बैंक ने रेपो दर को 6.5% पर स्थिर रखा है और चालू वित्त वर्ष के लिए जीडीपी वृद्धि दर के अनुमान को बढ़ाकर 7.4% कर दिया है, जिससे सेंसेक्स में उछाल देखा गया।",
        takeaways: [
          "रेपो रेट 6.5% पर यथावत बनाए रखने का सर्वसम्मत निर्णय।",
          "मुद्रास्फीति 4.1% के दायरे में रहने की संभावना।",
          "सेंसेक्स 84,000 के पार, बैंकिंग शेयरों में जोरदार बढ़त।",
        ],
        fullArticle: "मुंबई में आरबीआई गवर्नर ने मौद्रिक नीति समिति के फैसलों की घोषणा करते हुए भारतीय अर्थव्यवस्था के मजबूत बने रहने का विश्वास जताया।",
      },
      kn: {
        headline: "ಆರ್‌ಬಿಐ ರೆಪೊ ದರ 6.5% ಸ್ಥಿರ, ಜಿಡಿಪಿ ಬೆಳವಣಿಗೆ 7.4% ಅಂದಾಜು",
        summary: "ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ರೆಪೋ ದರವನ್ನು 6.5% ದರದಲ್ಲಿ ಉಳಿಸಿಕೊಂಡಿದ್ದು, ಜಿಡಿಪಿ ಬೆಳವಣಿಗೆಯನ್ನು 7.4% ಎಂದು ಅಂದಾಜಿಸಿದೆ.",
        takeaways: ["ರೆಪೊ ದರದಲ್ಲಿ ಯಾವುದೇ ಬದಲಾವಣೆ ಇಲ್ಲ.", "ಷೇರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ 500ಕ್ಕೂ ಹೆಚ್ಚು ಅಂಕಗಳ ಏರಿಕೆ."],
        fullArticle: "ಆರ್‌ಬಿಐ ಹಣಕಾಸು ನೀತಿ ಸಮಿತಿಯು ಮುಂಬೈನಲ್ಲಿ ಸಭೆ ನಡೆಸಿ ಮಹತ್ವದ ನಿರ್ಧಾರಗಳನ್ನು ಪ್ರಕಟಿಸಿದೆ.",
      },
      ta: {
        headline: "ரிசர்வ் வங்கி ரெப்போ வட்டி விகிதத்தில் மாற்றமில்லை, ஜிடிபி 7.4% ஆக உயரும்",
        summary: "ரெப்போ வட்டி விகிதத்தை 6.50% என்ற அளவில் தொடர ரிசர்வ் வங்கி முடிவு செய்துள்ளதுடன், பொருளாதார வளர்ச்சி 7.4% ஆக இருக்கும் என கணித்துள்ளது.",
        takeaways: ["ரெப்போ வட்டி 6.5% ஆக நீடிப்பு.", "பங்குச்சந்தை சென்செக்ஸ் 84,000 புள்ளிகளைத் தாண்டியது."],
        fullArticle: "மும்பையில் நடந்த நாணயக் கொள்கைக் கூட்டத்தில் இந்த அறிவிப்பு வெளியிடப்பட்டது.",
      },
      te: {
        headline: "రెపో రేటు 6.5% వద్ద స్థిరంగా ఉంచిన ఆర్బీఐ, జీడీపీ వృద్ధి అంచనా 7.4%",
        summary: "రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా రెపో రేటును మార్చకుండా 6.5% వద్దే కొనసాగించింది. జీడీపీ వృద్ధి రేటును 7.4 శాతంగా అంచనా వేసింది.",
        takeaways: ["వడ్డీ రేట్లలో మార్పు లేదు.", "సెన్సెక్స్ 500 పాయింట్లకు పైగా లాభపడింది."],
        fullArticle: "ఆర్బీఐ గవర్నర్ ముంబైలో ద్రవ్య విధాన కమిటీ సమీక్ష వివరాలను వెల్లడించారు.",
      },
      mr: {
        headline: "आरबीआयचा मोठा निर्णय: रेपो दर ६.५ टक्क्यांवर कायम, विकास दर ७.४% राहण्याचा अंदाज",
        summary: "रिझर्व्ह बँकेने रेपो दरात कोणताही बदल न करता तो ६.५% वर कायम ठेवला आहे. देशाचा विकास दर ७.४% राहण्याचा विश्वास व्यक्त केला.",
        takeaways: ["रेपो दर स्थिर राहिल्याने गृहकर्ज व्याजदरात सध्यातरी बदल नाही.", "मुंबई शेअर बाजारात तेजीचे वातावरण."],
        fullArticle: "मुंबईत आरबीआयचे गव्हर्नर यांनी पतधोरण समितीच्या बैठकीतील निर्णयांची माहिती दिली.",
      },
      bn: {
        headline: "রেপো রেট ৬.৫%-এই অপরিবর্তিত রাখল আরবিআই, বৃদ্ধি পাবে জিডিপি",
        summary: "ভারতীয় রিজার্ভ ব্যাংক রেপো রেট অপরিবর্তিত রেখে ভারতের জিডিপি প্রবৃদ্ধির লক্ষ্যমাত্রা বাড়িয়ে ৭.৪% করেছে।",
        takeaways: ["সুদের হার অপরিবর্তিত রইল।", "শেয়ার বাজার সূচক সেনসেক্স নতুন উচ্চতায়।"],
        fullArticle: "মুম্বাইয়ে ভারতীয় রিজার্ভ ব্যাংকের গভর্নর আর্থিক নীতি ঘোষণা করেছেন।",
      },
    },
  },
  {
    id: "markets-green-hydrogen-bidding",
    genre: "markets",
    originalLanguage: "en",
    region: { country: "India", state: "Delhi NCR", city: "New Delhi" },
    imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Energy Desk",
    sourceUrl: "https://zeenews.india.com/markets",
    authorName: "Rohit Saxena",
    authorRole: "contributor",
    velocityScore: 78,
    publishedHoursAgo: 8,
    motionSpec: { topic: "Green Hydrogen Investments", mood: "dynamic" },
    translations: {
      en: {
        headline: "India Concludes $4.2B Global Auction for Green Hydrogen and Ammonia Corridors",
        summary:
          "The Ministry of New and Renewable Energy has completed auctions allocating 1.5 million metric tonnes per annum of green ammonia capacity, attracting sovereign energy funds from Singapore, Germany, and domestic infrastructure majors.",
        takeaways: [
          "Bidding sets global record tariffs below $1.85 per kilogram of green hydrogen.",
          "Coastal production hubs targeted across Gujarat, Odisha, and Andhra Pradesh.",
          "Expected to curb crude oil import bills by over ₹35,000 crore annually.",
        ],
        fullArticle:
          "The national green hydrogen corridor strategy received massive investor backing today as the government wrapped up its phase-two capacity auctions in New Delhi.",
      },
      hi: {
        headline: "भारत ने ग्रीन हाइड्रोजन और अमोनिया के लिए $4.2 अरब की ऐतिहासिक नीलामी संपन्न की",
        summary:
          "नवीन एवं नवीकरणीय ऊर्जा मंत्रालय ने 15 लाख मीट्रिक टन क्षमता की वार्षिक ग्रीन अमोनिया नीलामी पूरी कर ली है, जिससे स्वच्छ ऊर्जा क्षेत्र को बड़ा बढ़ावा मिलेगा।",
        takeaways: [
          "$1.85 प्रति किग्रा के साथ विश्व में सबसे किफायती दरें हासिल की गईं।",
          "गुजरात, ओडिशा और आंध्र प्रदेश में स्थापित होंगे प्रमुख केंद्र।",
          "कच्चे तेल के आयात बिल में प्रति वर्ष 35,000 करोड़ रुपये की बचत का अनुमान।",
        ],
        fullArticle: "नई दिल्ली में नवीन और नवीकरणीय ऊर्जा मंत्रालय ने ग्रीन हाइड्रोजन मिशन के तहत ऐतिहासिक बोलियां पूरी कीं।",
      },
      kn: {
        headline: "ಹಸಿರು ಹೈಡ್ರೋಜನ್ ಕಾರಿಡಾರ್‌ಗಾಗಿ ಭಾರತದಲ್ಲಿ $4.2 ಶತಕೋಟಿ ಹೂಡಿಕೆ ಬಿಡ್ಡಿಂಗ್ ಪೂರ್ಣ",
        summary: "ಭಾರತ ಸರಕಾರವು ಪರಿಸರ ಸ್ನೇಹಿ ಹಸಿರು ಹೈಡ್ರೋಜನ್ ಯೋಜನೆಗಾಗಿ ಬೃಹತ್ ಜಾಗತಿಕ ಹರಾಜು ಪ್ರಕ್ರಿಯೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮುಗಿಸಿದೆ.",
        takeaways: ["ಜಾಗತಿಕ ಮಟ್ಟದಲ್ಲಿ ಅತಿ ಕಡಿಮೆ ದರಗಳ ಬಿಡ್ಡಿಂಗ್.", "ವಾರ್ಷಿಕ ತೈಲ ಆಮದು ವೆಚ್ಚದಲ್ಲಿ ಭಾರಿ ಇಳಿಕೆ."],
        fullArticle: "ನವದೆಹಲಿಯಲ್ಲಿ ನಡೆದ ಸಭೆಯಲ್ಲಿ ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಸಚಿವಾಲಯವು ಮಹತ್ವದ ಹೂಡಿಕೆ ವಿವರಗಳನ್ನು ಬಹಿರಂಗಪಡಿಸಿದೆ.",
      },
      ta: {
        headline: "பசுமை ஹைட்ரஜன் திட்டங்களுக்கு $4.2 பில்லியன் உலகளாவிய முதலீடு",
        summary: "இந்தியாவின் பசுமை ஹைட்ரஜன் திட்டங்களுக்கான ஏலம் வெற்றிகரமாக முடிவடைந்து, உலக முதலீட்டாளர்களை கவர்ந்துள்ளது.",
        takeaways: ["மிகக் குறைந்த விலையில் பசுமை ஹைட்ரஜன் உற்பத்தி.", "ஆண்டுக்கு ₹35,000 கோடி கச்சா எண்ணெய் இறக்குமதி மிச்சமாகும்."],
        fullArticle: "புதுப்பிக்கத்தக்க எரிசக்தி அமைச்சகம் புதிய முதலீட்டு திட்டங்களை அறிவித்துள்ளது.",
      },
      te: {
        headline: "గ్రీన్ హైడ్రోజన్ కారిడార్లకు $4.2 బిలియన్ల గ్లోబల్ వేలం విజయవంతం",
        summary: "భారత పునరుత్పాదక ఇంధన మంత్రిత్వ శాఖ నిర్వహించిన గ్రీన్ హైడ్రోజన్ మరియు అమ్మోనియా ప్రాజెక్టుల వేలం రికార్డు స్థాయి పెట్టుబడులను ఆకర్షించింది.",
        takeaways: ["కిలోకు $1.85 అతి తక్కువ టారిఫ్ సాధించబడింది.", "గుజరాత్, ఏపీ తీర ప్రాంతాల్లో భారీ ప్లాంట్లు."],
        fullArticle: "న్యూఢిల్లీలో గ్రీన్ ఎనర్జీ మిషన్ రెండో దశ వేలం వివరాలు వెల్లడయ్యాయి.",
      },
      mr: {
        headline: "ग्रीन हायड्रोजन प्रकल्पांसाठी भारताला $४.२ अब्ज डॉलरच्या जागतिक बोली",
        summary: "ऊर्जा मंत्रालयाने ग्रीन हायड्रोजन कॉरिडॉरसाठी आंतरराष्ट्रीय लिलाव यशस्वीरीत्या पूर्ण केला असून विक्रमी गुंतवणूक आली आहे.",
        takeaways: ["सर्वात स्वस्त दरात ग्रीन हायड्रोजन निर्मितीचे उद्दिष्ट.", "परकीय चलन बचतीला मोठी मदत."],
        fullArticle: "नवी दिल्लीत केंद्र सरकारने हरित ऊर्जा क्षेत्रातील ऐतिहासिक यशाची घोषणा केली.",
      },
      bn: {
        headline: "সবুজ হাইড্রোজেন করিডোরের জন্য ৪.২ বিলিয়ন ডলারের আন্তর্জাতিক নিলাম সম্পন্ন",
        summary: "ভারত সরকার পরিবেশবান্ধব গ্রিন হাইড্রোজেন ও অ্যামোনিয়া প্রকল্পের জন্য ঐতিহাসিক নিলাম প্রক্রিয়া সফলভাবে সম্পন্ন করেছে।",
        takeaways: ["সবুজ হাইড্রোজেনের বিশ্বরেকর্ড সস্তা দর অর্জিত।", "বার্ষিক ৩৫ হাজার কোটি টাকার তেল আমদানি খরচ সাশ্রয়।"],
        fullArticle: "নয়াদিল্লিতে কেন্দ্রীয় শক্তি মন্ত্রক এই বিপুল বিনিয়োগের ঘোষণা করেছে।",
      },
    },
  },
  // -------------------------------------------------
  // 3. SPORTS
  // -------------------------------------------------
  {
    id: "sports-champions-trophy-india-victory",
    genre: "sports",
    originalLanguage: "en",
    region: { country: "India", state: "Tamil Nadu", city: "Chennai" },
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Sports Central",
    sourceUrl: "https://zeenews.india.com/sports",
    authorName: "R Ashwin Kumar",
    authorRole: "editor",
    velocityScore: 98,
    publishedHoursAgo: 1,
    motionSpec: { topic: "Cricket Victory", mood: "celebratory" },
    translations: {
      en: {
        headline: "India Lifts Champions Trophy in Thrilling Final Ball Finish Against Australia at Chepauk",
        summary:
          "In an electric atmosphere at the MA Chidambaram Stadium in Chennai, Team India defended 14 runs off the final over to clinch the ICC Champions Trophy title, driven by an unbeaten 87 from Shubman Gill and Jasprit Bumrah's deadly yorkers.",
        takeaways: [
          "India clinched victory by 4 runs in a heart-stopping final ball climax.",
          "Shubman Gill named Player of the Match for a composed 87* under high pressure.",
          "Jasprit Bumrah bowled 4 dot balls in the 50th over defending 14 runs.",
        ],
        fullArticle:
          "The MA Chidambaram Stadium erupted in a sea of blue on Sunday evening as India captured the ICC Champions Trophy, prevailing over reigning world champions Australia.",
      },
      hi: {
        headline: "चेपॉक में रोमांचक अंतिम गेंद पर ऑस्ट्रेलिया को हराकर भारत बना चैंपियंस ट्रॉफी विजेता",
        summary:
          "चेन्नई के चेपॉक स्टेडियम में खेले गए सांसें रोक देने वाले फाइनल मुकाबले में भारतीय क्रिकेट टीम ने ऑस्ट्रेलिया को 4 रनों से हराकर आईसीसी चैंपियंस ट्रॉफी का खिताब अपने नाम कर लिया।",
        takeaways: [
          "अंतिम ओवर में जसप्रीत बुमराह की घातक यॉर्कर गेंदों ने दिलाई रोमांचक जीत।",
          "शुभमन गिल की नाबाद 87 रनों की पारी बनी मैच का निर्णायक मोड़।",
          "पूरे देश में क्रिकेट प्रेमियों ने आतिशबाजी और ढोल-नगाड़ों के साथ मनाया जश्न।",
        ],
        fullArticle: "चेन्नई के ऐतिहासिक मैदान पर रविवार रात भारतीय टीम ने फिर साबित किया कि वह विश्व क्रिकेट की सबसे मजबूत ताकत है।",
      },
      kn: {
        headline: "ಚೆಪಾಕ್‌ನಲ್ಲಿ ಕೊನೆಯ ಎಸೆತದ ಥ್ರಿಲ್ಲರ್: ಆಸ್ಟ್ರೇಲಿಯಾ ವಿರುದ್ಧ ಭಾರತಕ್ಕೆ ಚಾಂಪಿಯನ್ಸ್ ಟ್ರೋಫಿ ಗರಿ!",
        summary:
          "ಚೆನ್ನೈನ ಚೆಪಾಕ್ ಕ್ರೀಡಾಂಗಣದಲ್ಲಿ ನಡೆದ ಅಂತಿಮ ಪಂದ್ಯದಲ್ಲಿ ಭಾರತ ತಂಡವು ಆಸ್ಟ್ರೇಲಿಯಾ ವಿರುದ್ಧ 4 ರನ್‌ಗಳ ರೋಚಕ ಜಯ ಸಾಧಿಸಿ ಚಾಂಪಿಯನ್ಸ್ ಟ್ರೋಫಿಯನ್ನು ಮುಡಿಗೇರಿಸಿಕೊಂಡಿತು.",
        takeaways: ["ಬುಮ್ರಾ ಅವರ ಮಾರಕ ಬೌಲಿಂಗ್‌ನಿಂದ ಭಾರತಕ್ಕೆ ಜಯ.", "ಶುಭಮನ್ ಗಿಲ್ ಅಜೇಯ 87 ರನ್ ಗಳಿಸಿ ಪಂದ್ಯಶ್ರೇಷ್ಠ."],
        fullArticle: "ಚೆನ್ನೈ ಕ್ರೀಡಾಂಗಣದಲ್ಲಿ ಕ್ರಿಕೆಟ್ ಅಭಿಮಾನಿಗಳ ಹರ್ಷೋದ್ಗಾರ ಮುಗಿಲು ಮುಟ್ಟಿದೆ.",
      },
      ta: {
        headline: "சேப்பாக்கத்தில் கடைசி பந்து த்ரில்லர்: ஆஸ்திரேலியாவை வீழ்த்தி சாம்பியன்ஸ் டிராபியை வென்றது இந்தியா!",
        summary:
          "சென்னையின் சேப்பாக்கம் மைதானத்தில் நடந்த இறுதிப் போட்டியில், கடைசி ஓவரில் 14 ரன்களைக் கட்டுப்படுத்தி ஆஸ்திரேலியாவை வீழ்த்தி இந்தியா கோப்பையைக் கைப்பற்றியது.",
        takeaways: [
          "கடைசி ஓவரில் பும்ராவின் அனல் பறக்கும் யார்க்கர் பந்துவீச்சு வெற்றி தேடித்தந்தது.",
          "சுப்மன் கில் ஆட்டமிழக்காமல் 87 ரன்கள் குவித்து ஆட்டநாயகன் விருது வென்றார்.",
          "இந்தியா 4 ரன்கள் வித்தியாசத்தில் த்ரில் வெற்றி பெற்று சாம்பியன் ஆனது.",
        ],
        fullArticle: "சென்னையில் நடைபெற்ற ஐசிசி சாம்பியன்ஸ் டிராபி இறுதிப் போட்டியில் இந்தியா அபார வெற்றி பெற்றது.",
      },
      te: {
        headline: "చెపాక్ లో ఉత్కంఠభరిత ఫైనల్: ఆస్ట్రేలియాపై గెలిచి ఛాంపియన్స్ ట్రోఫీ గెలిచిన భారత్",
        summary:
          "చెన్నై వేదికగా జరిగిన తుది పోరులో భారత్ 4 పరుగుల తేడాతో ఆస్ట్రేలియాను ఓడించి ఐసీసీ ఛాంపియన్స్ ట్రోఫీని కైవసం చేసుకుంది.",
        takeaways: ["చివరి ఓవర్‌లో బుమ్రా అద్భుత బౌలింగ్.", "శుభ్‌మన్ గిల్ 87 పరుగులతో మ్యాచ్ విన్నర్."],
        fullArticle: "చెన్నైలోని చిదంబరం స్టేడియంలో భారత అభిమానులు సంబరాల్లో మునిగిపోయారు.",
      },
      mr: {
        headline: "चेपॉकवर थरारक विजय! ऑस्ट्रेलियाला नमवून भारताने जिंकली चॅम्पियन्स ट्रॉफी",
        summary:
          "चेन्नईत झालेल्या अटीतटीच्या अंतिम सामन्यात भारताने ऑस्ट्रेलियाचा ४ धावांनी पराभव करत आयसीसी चॅम्पियन्स ट्रॉफीवर आपले नाव कोरले.",
        takeaways: ["बुमराहच्या अचूक यॉर्कर्समुळे भारताचा रोमहर्षक विजय.", "शुभमन गिल ठरला सामनावीर."],
        fullArticle: "चेन्नईच्या ऐतिहासिक मैदानावर भारतीय क्रिकेट संघाने पुन्हा एकदा विश्वविजेतेपदाचा झेंडा फडकवला.",
      },
      bn: {
        headline: "চিপকে শেষ বলের রোমাঞ্চ! অস্ট্রেলিয়াকে হারিয়ে চ্যাম্পিয়ন্স ট্রফি জয় ভারতের",
        summary:
          "চেন্নাইয়ের চেপক স্টেডিয়ামে শ্বাসরুদ্ধকর ফাইনালে অস্ট্রেলিয়াকে ৪ রানে হারিয়ে আইসিসি চ্যাম্পিয়ন্স ট্রফি চ্যাম্পিয়ন হলো টিম ইন্ডিয়া।",
        takeaways: ["জসপ্রীত বুমরাহের দুর্দান্ত শেষ ওভারের ম্যাজিক।", "শুভমান গিলের অপরাজিত ৮৭ রানের লড়াকু ইনিংস।"],
        fullArticle: "রবিবার রাতে চেন্নাইয়ে নীল জার্সির জয়োল্লাসে মেতে উঠল গোটা ভারত।",
      },
    },
  },
  {
    id: "sports-badminton-world-tour-finals",
    genre: "sports",
    originalLanguage: "en",
    region: { country: "India", state: "Telangana", city: "Hyderabad" },
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Sports Desk",
    sourceUrl: "https://zeenews.india.com/sports",
    authorName: "Pranitha Reddy",
    authorRole: "contributor",
    velocityScore: 82,
    publishedHoursAgo: 7,
    motionSpec: { topic: "Badminton Victory", mood: "dynamic" },
    translations: {
      en: {
        headline: "Satwik-Chirag Pair Storms Into BWF World Tour Finals With Dominant Straight-Sets Win",
        summary:
          "India's premier men's doubles pair Satwiksairaj Rankireddy and Chirag Shetty delivered a clinical masterclass in Hyderabad, dismantling the world number two Indonesian duo 21-16, 21-14 to seal their championship berth.",
        takeaways: [
          "Dominant 38-minute victory propelled by relentless smash speeds above 420 km/h.",
          "Guarantees World No. 1 ranking recovery in the upcoming BWF cycle.",
          "Sets up marquee gold medal clash against China's Liang and Wang.",
        ],
        fullArticle:
          "Displaying ferocious court coverage and tactical aggression, the Indian duo dominated every rally from the opening exchanges at the Gachibowli Stadium.",
      },
      hi: {
        headline: "सात्विक-चिराग की जोड़ी सीधे सेटों में जीतकर बीडब्ल्यूएफ वर्ल्ड टूर फाइनल्स में पहुंची",
        summary:
          "भारत की स्टार बैडमिंटन जोड़ी सात्विकसाईराज रंकीरेड्डी और चिराग शेट्टी ने हैदराबाद में इंडोनेशियाई जोड़ी को 21-16, 21-14 से हराकर फाइनल में जगह बना ली।",
        takeaways: [
          "38 मिनट के मुकाबले में 420 किमी/घंटा की रफ्तार से स्मैश की बरसात।",
          "विश्व रैंकिंग में फिर से नंबर 1 बनने का रास्ता साफ।",
          "फाइनल में चीन की शीर्ष जोड़ी से होगा महामुकाबला।",
        ],
        fullArticle: "हैदराबाद के गाचीबोवली इंडोर स्टेडियम में भारतीय प्रशंसकों ने सात्विक और चिराग के शानदार खेल का जोरदार स्वागत किया।",
      },
      kn: {
        headline: "ಸಾತ್ವಿಕ್-ಚಿರಾಗ್ ಜೋಡಿ ಬಿಡಬ್ಲ್ಯುಎಫ್ ವಿಶ್ವ ಟೂರ್ ಫೈನಲ್ಸ್‌ಗೆ ಲಗ್ಗೆ",
        summary: "ಭಾರತದ ಸ್ಟಾರ್ ಜೋಡಿ ಸಾತ್ವಿಕ್-ಚಿರಾಗ್ ಹೈದರಾಬಾದ್‌ನಲ್ಲಿ ನಡೆದ ಸೆಮಿಫೈನಲ್‌ನಲ್ಲಿ ಇಂಡೋನೇಷ್ಯಾ ಜೋಡಿಯನ್ನು ನೇರ ಸೆಟ್‌ಗಳಿಂದ ಸೋಲಿಸಿದರು.",
        takeaways: ["21-16, 21-14 ನೇರ ಸೆಟ್‌ಗಳ ಗೆಲುವು.", "ಮತ್ತೆ ವಿಶ್ವ ನಂ.1 ಶ್ರೇಯಾಂಕ ಪಡೆಯುವ ನಿರೀಕ್ಷೆ."],
        fullArticle: "ಭಾರತೀಯ ಬ್ಯಾಡ್ಮಿಂಟನ್ ರಂಗದಲ್ಲಿ ಮತ್ತೊಂದು ಹೆಮ್ಮೆಯ ಸಾಧನೆ ದಾಖಲಾಗಿದೆ.",
      },
      ta: {
        headline: "சாத்விக்-சிராக் இணை உலக டூர் பேட்மிண்டன் இறுதிப்போட்டிக்கு தகுதி",
        summary: "ஹைதராபாத்தில் நடந்த அரையிறுதியில் இந்தோனேசிய இணையை வீழ்த்தி இந்திய நட்சத்திர இணை சாத்விக்-சிராக் இறுதிப்போட்டிக்கு முன்னேறியது.",
        takeaways: ["நேரடி செட்களில் அபார வெற்றி.", "மீண்டும் உலக தரவரிசையில் முதலிடம் பிடிக்கும் வாய்ப்பு."],
        fullArticle: "இந்திய இரட்டையர் பேட்மிண்டன் வரலாற்றில் தொடர் வெற்றிகள் குவிகின்றன.",
      },
      te: {
        headline: "సాత్విక్-చిరాగ్ జోడీ బీడబ్ల్యూఎఫ్ వరల్డ్ టూర్ ఫైనల్స్‌కు చేరిక",
        summary:
          "హైదరాబాద్ గచ్చిబౌలి స్టేడియంలో జరిగిన సెమీస్‌లో సాత్విక్‌సాయిరాజ్-చిరాగ్ శెట్టి జోడీ ఇండోనేషియా ద్వయాన్ని 21-16, 21-14తో చిత్తు చేసి ఫైనల్ చేరింది.",
        takeaways: ["గచ్చిబౌలిలో 38 నిమిషాల్లో ముగిసిన మ్యాచ్.", "ప్రపంచ నంబర్ వన్ ర్యాంక్ దిశగా ముందడుగు."],
        fullArticle: "తెలుగు ప్రేక్షకుల హర్షధ్వానాల మధ్య సాత్విక్-చిరాగ్ జోడీ అద్భుత విజయాన్ని అందుకుంది.",
      },
      mr: {
        headline: "सात्विक-चिराग जोडीची वर्ल्ड टूर फायनल्समध्ये धडक",
        summary: "हैदराबाद येथे झालेल्या सामन्यात भारताच्या सात्विक-चिराग जोडीने इंडोनेशियन प्रतिस्पर्ध्यांचा धुव्वा उडवला.",
        takeaways: ["२१-१६, २१-१४ अशा सरळ सेट्समध्ये विजय.", "फायनलमध्ये सुवर्णपदकासाठी लढत."],
        fullArticle: "भारतीय बॅडमिंटनपटूंनी पुन्हा एकदा आपली आंतरराष्ट्रीय ताकद सिद्ध केली.",
      },
      bn: {
        headline: "সাত্বিক-চিরাগ জুটি বিডব্লিউএফ ওয়ার্ল্ড ট্যুর ফাইনালসে",
        summary: "হায়দরাবাদে ইন্দোনেশিয়ার জুটিকে স্ট্রেট সেটে উড়িয়ে দিয়ে ফাইনালে পৌঁছাল ভারতের তারকা জুটি সাত্বিকসাইরাজ এবং চিরাগ শেট্টি।",
        takeaways: ["২১-১৬, ২১-১৪ ব্যবধানে জয়।", "বিশ্ব ক্রমতালিকায় এক নম্বরে ওঠার পথে ভারত।"],
        fullArticle: "ভারতীয় ব্যাডমিন্টনের সোনালী অধ্যায় অব্যাহত রেখে ফাইনাল নিশ্চিত করলেন সাত্বিক ও চিরাগ।",
      },
    },
  },
  // -------------------------------------------------
  // 4. POLITICS & GOVERNANCE
  // -------------------------------------------------
  {
    id: "politics-sc-digital-privacy-ruling",
    genre: "politics",
    originalLanguage: "en",
    region: { country: "India", state: "Delhi NCR", city: "New Delhi" },
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee National Bureau",
    sourceUrl: "https://zeenews.india.com/india",
    authorName: "Devika Narayanan",
    authorRole: "editor",
    velocityScore: 89,
    publishedHoursAgo: 4,
    motionSpec: { topic: "Supreme Court Constitution Bench", mood: "grave" },
    translations: {
      en: {
        headline: "Supreme Court Constitution Bench Reaffirms End-to-End Encryption as Fundamental Privacy Right",
        summary:
          "In a unanimous 5-0 verdict, the Supreme Court of India ruled that government mandates forcing backdoor decryption keys on messaging platforms violate Article 21's fundamental guarantee of personal privacy and communicative autonomy.",
        takeaways: [
          "5-judge Constitution bench strikes down mandatory traceability rules without warrant.",
          "Targeted lawful intercepts permitted only via high-court judicial authorization.",
          "Protects privacy of over 600 million smartphone messaging users in India.",
        ],
        fullArticle:
          "A five-judge Constitution bench headed by the Chief Justice of India delivered a landmark digital rights judgment on Tuesday morning.",
      },
      hi: {
        headline: "सुप्रीम कोर्ट का ऐतिहासिक फैसला: एंड-टू-एंड एन्क्रिप्शन निजता के मौलिक अधिकार का अभिन्न हिस्सा",
        summary:
          "सर्वोच्च न्यायालय की 5 जजों की संविधान पीठ ने सर्वसम्मति से फैसला सुनाया कि मैसेजिंग प्लेटफॉर्म पर बैकडोर डिक्रिप्शन लागू करना संविधान के अनुच्छेद 21 का उल्लंघन है।",
        takeaways: [
          "बिना न्यायिक वारंट के संदेशों की अनिवार्य ट्रैकिंग को असंवैधानिक ठहराया।",
          "60 करोड़ से अधिक भारतीय इंटरनेट उपयोगकर्ताओं की डिजिटल निजता सुरक्षित।",
          "सुरक्षा एजेंसियों के लिए केवल उच्च न्यायालय की अनुमति से ही निगरानी संभव।",
        ],
        fullArticle: "नई दिल्ली स्थित सर्वोच्च न्यायालय के मुख्य न्यायाधीश की अध्यक्षता वाली संविधान पीठ ने यह ऐतिहासिक फैसला सुनाया।",
      },
      kn: {
        headline: "ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಮಹತ್ವದ ತೀರ್ಪು: ಎಂಡ್-ಟು-ಎಂಡ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್ ಖಾಸಗಿತನದ ಮೂಲಭೂತ ಹಕ್ಕು",
        summary:
          "ಸಂವಿಧಾನ ಪೀಠವು ಮೆಸೇಜಿಂಗ್ ಆ್ಯಪ್‌ಗಳಲ್ಲಿ ಕಡ್ಡಾಯ ಡಿಕ್ರಿಪ್ಶನ್ ನಿಯಮವನ್ನು ರದ್ದುಗೊಳಿಸಿ, ಖಾಸಗಿತನದ ರಕ್ಷಣೆಗೆ ಆದ್ಯತೆ ನೀಡಿದೆ.",
        takeaways: ["5-0 ಸರ್ವಾನುಮತದ ತೀರ್ಪು.", "60 ಕೋಟಿ ಭಾರತೀಯ ಬಳಕೆದಾರರ ಖಾಸಗಿತನಕ್ಕೆ ಜಯ."],
        fullArticle: "ನವದೆಹಲಿಯ ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಐತಿಹಾಸಿಕ ತೀರ್ಪು ಪ್ರಕಟಿಸಿದೆ.",
      },
      ta: {
        headline: "உச்ச நீதிமன்றம் வரலாற்றுத் தீர்ப்பு: தகவல் என்க்ரிப்ஷன் தனிநபர் உரிமை",
        summary: "மெசேஜிங் செயலிகளில் உளவு பார்க்கும் அரசு விதியை நிராகரித்து, தனிநபர் சுதந்திரத்தை உச்ச நீதிமன்றம் உறுதி செய்துள்ளது.",
        takeaways: ["அரசியலமைப்பு அமர்வின் 5-0 ஒருமனதான தீர்ப்பு.", "வாட்ஸ்அப், டெலிகிராம் பயனர்களின் தகவல் ரகசியம் காக்கப்படும்."],
        fullArticle: "இந்திய உச்ச நீதிமன்றம் டிஜிட்டல் உரிமைகளில் புதிய மைல்கல்லை எட்டியுள்ளது.",
      },
      te: {
        headline: "సుప్రీంకోర్టు సంచలన తీర్పు: ఎండ్-టు-ఎండ్ ఎన్‌క్రిప్షన్ ప్రాథమిక హక్కు",
        summary:
          "మెసేజింగ్ యాప్‌లలో ఎన్‌క్రిప్షన్‌ను తొలగించాలనే నిబంధనను సుప్రీంకోర్టు రాజ్యాంగ ధర్మాసనం కొట్టివేసింది.",
        takeaways: ["5-0 ఏకగ్రీవ తీర్పు వెలువరించిన సుప్రీంకోర్టు.", "60 కోట్ల మంది వినియోగదారుల డేటా ప్రైవసీకి రక్షణ."],
        fullArticle: "న్యూఢిల్లీలో ప్రధాన న్యాయమూర్తి నేతృత్వంలోని రాజ్యాంగ ధర్మాసనం ఈ తీర్పును వెలువరించింది.",
      },
      mr: {
        headline: "सर्वोच्च न्यायालयाचा ऐतिहासिक निर्णय: एंड-टू-एंड एन्क्रिप्शन हा गोपनीयतेचा मूलभूत अधिकार",
        summary:
          "५ न्यायाधीशांच्या घटनापीठाने मेसेजिंग ॲप्सवरील सरकारी हस्तक्षेपाचा नियम फेटाळत नागरिकांच्या गोपनीयतेचा अधिकार अबाधित ठेवला.",
        takeaways: ["न्यायालयीन वॉरंटशिवाय मेसेज ट्रॅक करता येणार नाहीत.", "डिजिटल गोपनीयतेला सर्वोच्च संरक्षण."],
        fullArticle: "नवी दिल्लीत सर्वोच्च न्यायालयाने नागरिकांच्या मूलभूत अधिकारांवर शिक्कामोर्तब केले.",
      },
      bn: {
        headline: "সুপ্রিম কোর্টের ঐতিহাসিক রায়: এন্ড-টু-এন্ড এনক্রিপশন গোপনীয়তার মৌলিক অধিকার",
        summary:
          "মেসেজিং অ্যাপে নজরদারি চালানোর নিয়ম বাতিল করে নাগরিকদের ডিজিটাল সুরক্ষাকে মান্যতা দিল সুপ্রিম কোর্টের ৫ সদস্যের সাংবিধানিক বেঞ্চ।",
        takeaways: ["৫-০ সর্বসম্মত ঐতিহাসিক রায়।", "৬০ কোটি ভারতীয়র ব্যক্তিগত মেসেজের গোপনীয়তা অটুট থাকবে।"],
        fullArticle: "ভারতের প্রধান বিচারপতির নেতৃত্বাধীন সাংবিধানিক বেঞ্চ এই যুগান্তকারী রায় ঘোষণা করেন।",
      },
    },
  },
  // -------------------------------------------------
  // 5. WEATHER & CLIMATE
  // -------------------------------------------------
  {
    id: "weather-monsoon-kerala-onset",
    genre: "weather",
    originalLanguage: "en",
    region: { country: "India", state: "Maharashtra", city: "Mumbai" },
    imageUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Weather Bureau",
    sourceUrl: "https://zeenews.india.com/weather",
    authorName: "Tanvi Shetye",
    authorRole: "editor",
    velocityScore: 86,
    publishedHoursAgo: 6,
    motionSpec: { topic: "Southwest Monsoon", mood: "urgent" },
    translations: {
      en: {
        headline: "IMD Forecasts 104% Above-Normal Southwest Monsoon With Early Western Coast Arrival",
        summary:
          "The India Meteorological Department has officially upgraded its long-range southwest monsoon projection to 104% of the Long Period Average, predicting an early onset over the Konkan coast and normal reservoir replenishment across peninsular river basins.",
        takeaways: [
          "Southwest monsoon rains forecast at 104% with positive Indian Ocean Dipole conditions.",
          "Early arrival projected over coastal Maharashtra and Karnataka within 96 hours.",
          "Agricultural prospects lifted for kharif pulses, oilseeds, and paddy sowing.",
        ],
        fullArticle:
          "Addressing a national briefing, the Director General of Meteorology confirmed that sea surface temperature metrics across the equatorial Indian Ocean favor steady precipitation.",
      },
      hi: {
        headline: "मौसम विभाग की अच्छी खबर: इस साल 104% सामान्य से अधिक मॉनसून, समय से पहले पहुंचेगा पश्चिमी तट",
        summary:
          "भारतीय मौसम विज्ञान विभाग (IMD) ने दक्षिण-पश्चिम मॉनसून के 104% सामान्य से अधिक रहने का अनुमान लगाया है, जिससे किसानों के चेहरे खिल गए हैं और खरीफ फसलों को भारी लाभ होगा।",
        takeaways: [
          "अनुकूल हिंद महासागर परिस्थितियों के कारण 104% औसत वर्षा का अनुमान।",
          "महाराष्ट्र और कर्नाटक के तटीय इलाकों में अगले 96 घंटों में मॉनसून की दस्तक।",
          "धान, दलहन और तिलहन की बुवाई के लिए स्थितियां अत्यंत अनुकूल।",
        ],
        fullArticle: "मौसम भवन नई दिल्ली से जारी बुलेटिन में बताया गया कि इस साल देश के जलाशयों में भरपूर पानी आने की उम्मीद है।",
      },
      kn: {
        headline: "ಹವಾಮಾನ ಇಲಾಖೆ ಸಿಹಿಸುದ್ದಿ: ಈ ಬಾರಿ ವಾಡಿಕೆಗಿಂತ 104% ಹೆಚ್ಚು ಮಳೆ ನಿರೀಕ್ಷೆ",
        summary: "ಭಾರತೀಯ ಹವಾಮಾನ ಇಲಾಖೆಯು ಈ ಬಾರಿಯ ಮುಂಗಾರು ಮಳೆಯು 104% ವಾಡಿಕೆಗಿಂತ ಹೆಚ್ಚಾಗಿರಲಿದೆ ಎಂದು ಮುನ್ಸೂಚನೆ ನೀಡಿದೆ.",
        takeaways: ["ಕರಾವಳಿ ಕರ್ನಾಟಕಕ್ಕೆ ಶೀಘ್ರವೇ ಮುಂಗಾರು ಪ್ರವೇಶ.", "ಕೃಷಿ ಚಟುವಟಿಕೆಗಳಿಗೆ ಭಾರಿ ಅನುಕೂಲ."],
        fullArticle: "ಹವಾಮಾನ ಇಲಾಖೆಯು ರೈತರಿಗೆ ಸಂತಸದ ಸುದ್ದಿ ಪ್ರಕಟಿಸಿದೆ.",
      },
      ta: {
        headline: "வானிலை மையம் குட் நியூஸ்: இந்த ஆண்டு 104% இயல்பை விட அதிக பருவமழை பெய்யும்",
        summary: "தென்மேற்கு பருவமழை இந்த ஆண்டு 104% இயல்பை விட அதிகமாக இருக்கும் என இந்திய வானிலை மையம் தெரிவித்துள்ளது.",
        takeaways: ["விவசாயிகளுக்கு பெரும் பலன் அளிக்கும்.", "அணைகளின் நீர்மட்டம் கணிசமாக உயரும்."],
        fullArticle: "இந்திய வானிலை ஆய்வு மையம் விரிவான பருவமழை அறிக்கையை வெளியிட்டுள்ளது.",
      },
      te: {
        headline: "రైతులకు శుభవార్త: ఈ ఏడాది 104% సమృద్ధిగా రుతుపవనాల వర్షాలు",
        summary: "భారత వాతావరణ శాఖ నైరుతి రుతుపవనాలపై సానుకూల అంచనాను విడుదల చేసింది. దేశవ్యాప్తంగా 104% వర్షపాతం నమోదవుతుందని తెలిపింది.",
        takeaways: ["ఖరీఫ్ పంటలకు మేలు చేకూరనుంది.", "పశ్చిమ తీరంలో ముందస్తు వర్షాలు."],
        fullArticle: "వాతావరణ శాఖ డైరెక్టర్ జనరల్ అధికారిక సమావేశంలో వివరాలు వెల్లడించారు.",
      },
      mr: {
        headline: "शेतकऱ्यांसाठी आनंदाची बातमी: यंदा १०४% दमदार मान्सून, महाराष्ट्रात लवकर आगमनाची शक्यता",
        summary:
          "हवामान खात्याने यंदा सरासरीपेक्षा १०४% पावसाचा अंदाज वर्तवला आहे. कोकण किनारपट्टीवर मान्सून वेळेआधी दाखल होणार आहे.",
        takeaways: ["खरीप पिकांसाठी पोषक हवामान.", "धरणसाठ्यात मोठी वाढ होण्याची शक्यता."],
        fullArticle: "पुणे आणि मुंबई वेधशाळेने मान्सूनच्या वाटचालीची माहिती दिली आहे.",
      },
      bn: {
        headline: "স্বস্তির খবর দিল আবহাওয়া দফতর: এবছর ১০৪% স্বাভাবিকের চেয়ে বেশি বর্ষা",
        summary:
          "মৌসম ভবন জানিয়েছে, দক্ষিণ-পশ্চিম মৌসুমী বায়ুর প্রভাবে চলতি বছর স্বাভাবিকের চেয়ে ১০৪ শতাংশ বেশি বৃষ্টিপাতের সম্ভাবনা রয়েছে।",
        takeaways: ["কৃষকদের মুখে হাসি, খারিফ চাষে বড় সুবিধা।", "জলাধারগুলিতে পর্যাপ্ত জল মজুত হবে।"],
        fullArticle: "ভারতের আবহাওয়া দফতর দীর্ঘমেয়াদী বর্ষা পূর্বাভাস প্রকাশ করেছে।",
      },
    },
  },
  // -------------------------------------------------
  // 6. ENTERTAINMENT
  // -------------------------------------------------
  {
    id: "entertainment-cannes-indian-film-grand-prix",
    genre: "entertainment",
    originalLanguage: "en",
    region: { country: "India", state: "Maharashtra", city: "Mumbai" },
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Cinema Desk",
    sourceUrl: "https://zeenews.india.com/entertainment",
    authorName: "Kunal Mehra",
    authorRole: "contributor",
    velocityScore: 92,
    publishedHoursAgo: 5,
    motionSpec: { topic: "Cannes Grand Prix", mood: "celebratory" },
    translations: {
      en: {
        headline: "Indian Indie Cinema Scores Major Triumph With Grand Prix Win at 78th Cannes Film Festival",
        summary:
          "Director Payal Sen's rural family drama 'Whispers of the Godavari' clinched the coveted Grand Prix at the 78th Cannes Film Festival, receiving a thunderous 11-minute standing ovation from international critics.",
        takeaways: [
          "First Indian production to bag the prestigious Grand Prix in over three decades.",
          "Praised universally for evocative cinematography capturing rural life along the Godavari.",
          "Secures worldwide theatrical distribution across Europe and North America.",
        ],
        fullArticle:
          "The Palais des Festivals in Cannes echoed with rapturous applause as jury president Cate Blanchett announced the Grand Prix honors for the Marathi-Hindi hybrid independent feature.",
      },
      hi: {
        headline: "कान्स फिल्म फेस्टिवल में भारतीय सिनेमा का परचम, 'गोदावरी की गूंज' को मिला प्रतिष्ठित ग्रैंड प्रिक्स अवार्ड",
        summary:
          "78वें कान्स फिल्म फेस्टिवल में भारतीय निर्देशक पायल सेन की फिल्म 'गोदावरी की गूंज' ने प्रतिष्ठित ग्रैंड प्रिक्स अवार्ड जीतकर इतिहास रच दिया। फिल्म को 11 मिनट का स्टैंडिंग ओवेशन मिला।",
        takeaways: [
          "तीन दशकों में पहली बार किसी भारतीय फिल्म को मिला यह सर्वोच्च सम्मान।",
          "ग्रामीण जीवन और मानवीय संवेदनाओं के जीवंत चित्रण की अंतरराष्ट्रीय प्रशंसा।",
          "यूरोप और उत्तरी अमेरिका में वैश्विक रिलीज के अधिकार हासिल किए।",
        ],
        fullArticle: "फ्रांस के कान्स शहर में आयोजित समारोह में भारतीय प्रतिनिधिमंडल ने गर्व से तिरंगा लहराया।",
      },
      kn: {
        headline: "ಕೇನ್ಸ್ ಫಿಲ್ಮ್ ಫೆಸ್ಟಿವಲ್‌ನಲ್ಲಿ ಭಾರತೀಯ ಚಿತ್ರಕ್ಕೆ ಪ್ರತಿಷ್ಠಿತ ಗ್ರ್ಯಾಂಡ್ ಪ್ರಿಕ್ಸ್ ಪ್ರಶಸ್ತಿ",
        summary: "78ನೇ ಕೇನ್ಸ್ ಚಲನಚಿತ್ರೋತ್ಸವದಲ್ಲಿ ಭಾರತೀಯ ಚಲನಚಿತ್ರವು ಗ್ರ್ಯಾಂಡ್ ಪ್ರಿಕ್ಸ್ ಪ್ರಶಸ್ತಿಯನ್ನು ಗೆದ್ದು ದೇಶಕ್ಕೆ ಕೀರ್ತಿ ತಂದಿದೆ.",
        takeaways: ["11 ನಿಮಿಷಗಳ ನಿರಂತರ ಚಪ್ಪಾಳೆ ಗೌರವ.", "ಜಾಗತಿಕ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಭಾರತೀಯ ಸಿನಿಮಾಗೆ ಮನ್ನಣೆ."],
        fullArticle: "ಫ್ರಾನ್ಸ್‌ನಲ್ಲಿ ನಡೆದ ವರ್ಣರಂಜಿತ ಸಮಾರಂಭದಲ್ಲಿ ಪ್ರಶಸ್ತಿ ಪ್ರದಾನ ಮಾಡಲಾಯಿತು.",
      },
      ta: {
        headline: "கான் திரைப்பட விழாவில் இந்திய சினிமா சாதனை: கிராண்ட் பிரிக்ஸ் விருதை தட்டிச் சென்றது",
        summary: "78வது கான் திரைப்பட விழாவில் இந்திய திரைப்படத்திற்கு உயரிய கிராண்ட் பிரிக்ஸ் விருது கிடைத்துள்ளது.",
        takeaways: ["11 நிமிடங்கள் ரசிகர்கள் எழுந்து நின்று பாராட்டு.", "உலகத் திரைப்பட அரங்கில் இந்திய சினிமாவுக்கு பெருமை."],
        fullArticle: "பிரான்ஸ் நாட்டில் நடந்த திரைப்பட விழாவில் இந்திய படைப்பாளிகள் கவுரவிக்கப்பட்டனர்.",
      },
      te: {
        headline: "కేన్స్ ఫిల్మ్ ఫెస్టివల్‌లో భారతీయ చిత్రానికి అరుదైన గౌరవం: గ్రాండ్ ప్రిక్స్ అవార్డు కైవసం",
        summary: "78వ కేన్స్ చలన చిత్రోత్సవంలో భారతీయ స్వతంత్ర చిత్రం ప్రతిష్టాత్మక గ్రాండ్ ప్రిక్స్ అవార్డును గెలుచుకుంది.",
        takeaways: ["11 నిమిషాల పాటు కరతాళ ధ్వనులతో ప్రేక్షకుల ప్రశంసలు.", "అంతర్జాతీయ స్థాయిలో భారతీయ ప్రతిభ గుర్తింపు."],
        fullArticle: "ఫ్రాన్స్‌లో జరిగిన వేడుకలో జ్యూరీ ప్రెసిడెంట్ ఈ అవార్డును అందజేశారు.",
      },
      mr: {
        headline: "कान्स चित्रपट महोत्सवात भारतीय सिनेमाचा डंका! 'गोदावरी की गूंज'ला मानाचा ग्रँड प्रिक्स पुरस्कार",
        summary:
          "७८ व्या कान्स चित्रपट महोत्सवात ग्रामीण भारताचे दर्शन घडवणाऱ्या चित्रपटाने सर्वोच्च ग्रँड प्रिक्स पुरस्कार पटकावला.",
        takeaways: ["११ मिनिटे प्रेक्षकांकडून उभे राहून टाळ्यांचा कडकडाट.", "मराठी-हिंदी पार्श्वभूमीवरील कथेचे जगभरात कौतुक."],
        fullArticle: "फ्रान्समध्ये झालेल्या शानदार सोहळ्यात भारतीय दिग्दर्शिकेचा गौरव करण्यात आला.",
      },
      bn: {
        headline: "কান চলচ্চিত্র উৎসবে ভারতীয় সিনেমার ঐতিহাসিক জয়: গ্র্যান্ড প্রিক্স পুরষ্কার লাভ",
        summary: "৭৮তম কান চলচ্চিত্র উৎসবে ভারতীয় চলচ্চিত্র গ্র্যান্ড প্রিক্স খেতাব জিতে বিশ্বমঞ্চে ভারতের মুখ উজ্জ্বল করল।",
        takeaways: ["আন্তর্জাতিক দর্শকদের ১১ মিনিটের টানা করতালি।", "ইউরোপ ও আমেরিকায় বিশ্বব্যাপী মুক্তির চুক্তি সাক্ষরিত।"],
        fullArticle: "ফ্রান্সের কান চলচ্চিত্র উৎসবে এই মর্যাদাপূর্ণ পুরস্কার ঘোষণা করা হয়।",
      },
    },
  },
  // -------------------------------------------------
  // 7. CRIME & LAW
  // -------------------------------------------------
  {
    id: "crime-cbi-bengaluru-cyber-bust",
    genre: "crime",
    originalLanguage: "en",
    region: { country: "India", state: "Karnataka", city: "Bengaluru" },
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Crime Watch",
    sourceUrl: "https://zeenews.india.com/crime",
    authorName: "Shashank Joshi",
    authorRole: "editor",
    velocityScore: 84,
    publishedHoursAgo: 9,
    motionSpec: { topic: "Cyber Syndicate Bust", mood: "grave" },
    translations: {
      en: {
        headline: "CBI Dismantles International Cyber Cartel in Multi-City Raids, Seizes ₹180 Crore Crypto Assets",
        summary:
          "In a coordinated sweep spanning Bengaluru, Kolkata, and Noida, the Central Bureau of Investigation has neutralized an transnational cyber fraud syndicate targeting senior citizens across four continents, recovering cold wallets holding ₹180 crore.",
        takeaways: [
          "Simultaneous dawn raids conducted across 28 premises in three major tech hubs.",
          "Key kingpin apprehended while attempting to board a flight to Dubai.",
          "Over 12,000 victim accounts traced in collaboration with Interpol.",
        ],
        fullArticle:
          "Federal investigators dismantled one of South Asia's largest organized cyber crime syndicates following a six-month surveillance operation codenamed 'Operation Circuit Shield'.",
      },
      hi: {
        headline: "सीबीआई ने अंतरराष्ट्रीय साइबर गिरोह का किया भंडाफोड़, ₹180 करोड़ की क्रिप्टो संपत्ति जब्त",
        summary:
          "बेंगलुरु, कोलकाता और नोएडा में एक साथ छापेमारी कर सीबीआई ने अंतरराष्ट्रीय स्तर पर बुजुर्गों को ठगने वाले बड़े साइबर सिंडिकेट को ध्वस्त कर दिया है।",
        takeaways: [
          "28 ठिकानों पर एक साथ छापेमारी, मुख्य सरगना दुबई भागने की कोशिश में गिरफ्तार।",
          "इंटरपोल के सहयोग से 12,000 से अधिक पीड़ितों के बैंक खाते चिन्हित।",
          "₹180 करोड़ मूल्य के क्रिप्टोकरेंसी कोल्ड वॉलेट बरामद।",
        ],
        fullArticle: "केंद्रीय जांच ब्यूरो (सीबीआई) ने 'ऑपरेशन सर्किट शील्ड' के तहत इस बड़ी कार्रवाई को अंजाम दिया।",
      },
      kn: {
        headline: "ಸಿಬಿಐ ಭರ್ಜರಿ ಕಾರ್ಯಾಚರಣೆ: ಬೆಂಗಳೂರು ಸೇರಿ ಹಲವೆಡೆ ದಾಳಿ, ₹180 ಕೋಟಿ ಮೌಲ್ಯದ ಕ್ರಿಪ್ಟೋ ಆಸ್ತಿ ವಶ",
        summary: "ಬೆಂಗಳೂರು, ಕೋಲ್ಕತ್ತಾ ಮತ್ತು ನೋಯ್ಡಾದಲ್ಲಿ ಸಿಬಿಐ ನಡೆಸಿದ ದಾಳಿಯಲ್ಲಿ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ವಂಚಕರ ಜಾಲವನ್ನು ಭೇದಿಸಲಾಗಿದೆ.",
        takeaways: ["28 ಕಡೆಗಳಲ್ಲಿ ಏಕಕಾಲದಲ್ಲಿ ದಾಳಿ.", "ಪ್ರಮುಖ ಆರೋಪಿ ದುಬೈಗೆ ಪರಾರಿಯಾಗುವಾಗ ಸೆರೆ."],
        fullArticle: "ಸಿಬಿಐ ವಿಶೇಷ ತನಿಖಾ ದಳವು ಬೃಹತ್ ಸೈಬರ್ ದಂಧೆಯನ್ನು ಪತ್ತೆಹಚ್ಚಿದೆ.",
      },
      ta: {
        headline: "சிபிஐ அதிரடி வேட்டை: பெங்களூருவில் சர்வதேச சைபர் கும்பல் கைது, ₹180 கோடி கிரிப்டோ பறிமுதல்",
        summary: "பெங்களூரு, கொல்கத்தா உள்ளிட்ட நகரங்களில் சோதனை நடத்திய சிபிஐ, சர்வதேச சைபர் மோசடி கும்பலை கைது செய்தது.",
        takeaways: ["28 இடங்களில் தீவிர சோதனை.", "இன்டர்போல் உதவியுடன் ₹180 கோடி மதிப்புள்ள கிரிப்டோ சொத்துக்கள் முடக்கம்."],
        fullArticle: "மத்திய புலனாய்வு அமைப்பு விரிவான சைபர் குற்ற தடுப்பு நடவடிக்கையை மேற்கொண்டது.",
      },
      te: {
        headline: "సీబీఐ భారీ ఆపరేషన్: బెంగళూరులో అంతర్జాతీయ సైబర్ ముఠా గుట్టురట్టు, ₹180 కోట్ల క్రిప్టో జప్తు",
        summary:
          "బెంగళూరు, కోల్‌కతా, నోయిడాలలో ఏకకాలంలో దాడులు నిర్వహించిన సీబీఐ అంతర్జాతీయ సైబర్ మోసాల ముఠాను కటకటాల్లోకి నెట్టింది.",
        takeaways: ["28 ప్రాంతాల్లో మెరుపు దాడులు.", "దుబాయ్ పారిపోతుండగా కింగ్‌పిన్ అరెస్ట్."],
        fullArticle: "సీబీఐ అధికారులు 'ఆపరేషన్ సర్క్యూట్ షీల్డ్' ద్వారా ఈ ముఠాను పట్టుకున్నారు.",
      },
      mr: {
        headline: "सीबीआयची मोठी कारवाई: आंतरराष्ट्रीय सायबर टोळी उद्ध्वस्त, ₹१८० कोटींची क्रिप्टोकरन्सी जप्त",
        summary: "बंगळुरू, कोलकाता आणि नोएडामध्ये छापे टाकून सीबीआयने ज्येष्ठ नागरिकांची फसवणूक करणाऱ्या सायबर टोळीला गजाआड केले.",
        takeaways: ["२८ ठिकाणी एकाच वेळी छापे.", "दुबईला पळून जाण्याच्या प्रयत्नात सूत्रधार गजाआड."],
        fullArticle: "केंद्रीय अन्वेषण विभागाने (सीबीआय) सायबर गुन्हेगारीविरुद्ध मोठी मोहीम उघडली.",
      },
      bn: {
        headline: "সিবিআই-এর বিশাল অভিযান: কলকাতা ও বেঙ্গালুরু থেকে আন্তর্জাতিক সাইবার গ্যাং গ্রেফতার, ১৮০ কোটির ক্রিপ্টো বাজেয়াপ্ত",
        summary:
          "আন্তর্জাতিক সাইবার প্রতারণা চক্রের বিরুদ্ধে সাঁড়াশি অভিযান চালিয়ে ১৮০ কোটি টাকার ক্রিপ্টোকারেন্সি উদ্ধার করল সিবিআই।",
        takeaways: ["একযোগে ২৮টি ঠিকানায় অভিযান চালিয়ে মূল পাণ্ডা গ্রেফতার।", "ইন্টারপোলের সাহায্যে বিশ্বব্যাপী তথ্য অনুসন্ধান।"],
        fullArticle: "সিবিআই আধিকারিকরা 'অপারেশন সার্কিট শিল্ড'-এর মাধ্যমে এই চক্রটিকে ভেঙে দিয়েছেন।",
      },
    },
  },
  // -------------------------------------------------
  // 8. HEALTH & SCIENCE
  // -------------------------------------------------
  {
    id: "health-ai-cancer-biomarker-aiims",
    genre: "health",
    originalLanguage: "en",
    region: { country: "India", state: "Delhi NCR", city: "New Delhi" },
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    sourceName: "Zee Health Pulse",
    sourceUrl: "https://zeenews.india.com/health",
    authorName: "Dr. Radhika Iyer",
    authorRole: "editor",
    velocityScore: 90,
    publishedHoursAgo: 3,
    motionSpec: { topic: "AI Oncology Breakthrough", mood: "inspiring" },
    translations: {
      en: {
        headline: "AIIMS and IIT Delhi Unveil Ultra-Low Cost AI Blood Biomarker for Stage-1 Pancreatic Cancer Detection",
        summary:
          "Clinicians at AIIMS New Delhi, partnering with IIT Delhi biomedical engineers, have developed a nano-sensor AI diagnostic platform that detects Stage-1 pancreatic malignancies from a single drop of blood with 96.4% sensitivity.",
        takeaways: [
          "Detects asymptomatic early-stage tumors that typically evade conventional ultrasound scans.",
          "Diagnostic cost under ₹250 per test compared to ₹18,000 for complex PET-CT scans.",
          "Multi-center clinical trials scheduled to commence across 12 tier-2 district hospitals.",
        ],
        fullArticle:
          "Pancreatic ductal adenocarcinoma has long carried one of the grimmest prognoses in surgical oncology due to late detection. Tuesday's joint publication in Nature Biomedical Engineering changes that paradigm.",
      },
      hi: {
        headline: "एम्स और आईआईटी दिल्ली का चमत्कार: सिर्फ ₹250 में खून की एक बूंद से होगा स्टेज-1 कैंसर का पता",
        summary:
          "एम्स नई दिल्ली और आईआईटी दिल्ली के वैज्ञानिकों ने मिलकर एक ऐसा एआई नैनो-सेंसर तैयार किया है जो खून की एक बूंद से 96.4% सटीकता के साथ शुरुआती कैंसर की पहचान कर सकता है।",
        takeaways: [
          "शुरुआती स्टेज के ट्यूमर की पहचान जो अल्ट्रासाउंड में भी दिखाई नहीं देते।",
          "जांच का खर्च ₹18,000 के महंगे स्कैन के मुकाबले मात्र ₹250।",
          "देश के 12 जिला अस्पतालों में जल्द शुरू होंगे क्लिनिकल ट्रायल।",
        ],
        fullArticle: "नेचर बायोमेडिकल इंजीनियरिंग में प्रकाशित इस शोध को कैंसर उपचार के क्षेत्र में क्रांतिकारी माना जा रहा है।",
      },
      kn: {
        headline: "ಏಮ್ಸ್ ಮತ್ತು ಐಐಟಿ ದೆಹಲಿ ಸಂಶೋಧನೆ: ರಕ್ತದ ಒಂದು ಹನಿಯಿಂದಲೇ ಮೊದಲ ಹಂತದ ಕ್ಯಾನ್ಸರ್ ಪತ್ತೆ",
        summary: "ಏಮ್ಸ್ ಮತ್ತು ಐಐಟಿ ದೆಹಲಿಯ ವಿಜ್ಞಾನಿಗಳು ಕೇವಲ ₹250 ವೆಚ್ಚದಲ್ಲಿ ಆರಂಭಿಕ ಹಂತದ ಕ್ಯಾನ್ಸರ್ ಪತ್ತೆಹಚ್ಚುವ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ತಂತ್ರಜ್ಞಾನವನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸಿದ್ದಾರೆ.",
        takeaways: ["96.4% ನಿಖರತೆಯಿಂದ ಆರಂಭಿಕ ಹಂತದ ಕ್ಯಾನ್ಸರ್ ಪತ್ತೆ.", "ಸಾಮಾನ್ಯ ಜನರಿಗೆ ಕೈಗೆಟುಕುವ ವೆಚ್ಚ."],
        fullArticle: "ಭಾರತೀಯ ವೈದ್ಯಕೀಯ ವಿಜ್ಞಾನ ಕ್ಷೇತ್ರದಲ್ಲಿ ಅದ್ಭುತ ಆವಿಷ್ಕಾರ ಹೊರಬಂದಿದೆ.",
      },
      ta: {
        headline: "எய்ம்ஸ் மற்றும் ஐஐடி டெல்லி சாதனை: ஒரே துளி ரத்தத்தில் ஆரம்ப நிலை புற்றுநோயைக் கண்டறியும் ஏஐ கருவி",
        summary: "டெல்லி எய்ம்ஸ் மற்றும் ஐஐடி இணைந்து வெறும் ₹250 செலவில் ஆரம்ப நிலை கணைய புற்றுநோயைக் கண்டறியும் புதிய ஏஐ பரிசோதனை முறையைக் கண்டுபிடித்துள்ளனர்.",
        takeaways: ["96.4% துல்லியத்தன்மை கொண்ட நவீன ஏஐ சென்சார்.", "ஏழை எளிய மக்களுக்கு மிகப்பெரிய மருத்துவ வரப்பிரசாதம்."],
        fullArticle: "சர்வதேச மருத்துவ இதழான நேச்சரில் இந்த ஆய்வு முடிவுகள் வெளியிடப்பட்டுள்ளன.",
      },
      te: {
        headline: "ఎయిమ్స్, ఐఐటీ ఢిల్లీ సంచలనం: ఒక్క రక్తపు బొట్టుతో స్టేజ్-1 క్యాన్సర్ గుర్తింపు",
        summary:
          "కేవలం ₹250 ఖర్చుతో ప్రారంభ దశలోనే ప్రాణాంతక క్యాన్సర్‌ను గుర్తించే ఏఐ నానో-సెన్సార్‌ను ఢిల్లీ ఎయిమ్స్, ఐఐటీ శాస్త్రవేత్తలు ఆవిష్కరించారు.",
        takeaways: ["96.4% ఖచ్చితత్వంతో తొలి దశలోనే గుర్తింపు.", "సాధారణ ప్రజలకు అందుబాటులోకి రానున్న చౌకైన పరీక్ష."],
        fullArticle: "ఈ పరిశోధన భారతీయ వైద్య విజ్ఞాన రంగంలో విప్లవాత్మక మార్పుగా ప్రశంసలందుకుంటోంది.",
      },
      mr: {
        headline: "एम्स आणि आयआयटी दिल्लीचे क्रांतिकारी संशोधन: रक्ताच्या एका थेंबाने होणार पहिल्या टप्प्यातील कॅन्सरचे निदान",
        summary:
          "एम्स आणि आयआयटी दिल्लीने अवघ्या २५० रुपयांत स्वादुपिंडाच्या कॅन्सरचे निदान करणारे एआय तंत्रज्ञान विकसित केले आहे.",
        takeaways: ["९६.४% अचूकतेसह सुरुवातीच्या टप्प्यात गाठींचे निदान.", "सामान्य रुग्णांसाठी मोठा दिलासा."],
        fullArticle: "नेचर बायोमेडिकल इंजिनिअरिंग या नामांकित मासिकात हे संशोधन प्रसिद्ध झाले आहे.",
      },
      bn: {
        headline: "এইমস ও আইআইটি দিল্লির যুগান্তকারী আবিষ্কার: মাত্র এক ফোঁটা রক্তেই ধরা পড়বে স্টেজ-১ ক্যান্সার",
        summary:
          "দিল্লি এইমস এবং আইআইটি দিল্লির বিজ্ঞানীরা মাত্র ২৫০ টাকায় অগ্ন্যাশয়ের ক্যান্সার শনাক্ত করার একটি অভিনব এআই ন্যানো-সেন্সর তৈরি করেছেন।",
        takeaways: ["৯৬.৪% নিখুঁতভাবে প্রাথমিক পর্যায়ে টিউমার সনাক্তকরণ।", "দরিদ্র ও মধ্যবিত্তদের জন্য সাশ্রয়ী পরীক্ষা।"],
        fullArticle: "আন্তর্জাতিক গবেষণা পত্রিকা নেচারে এই যুগান্তকারী ভারতীয় আবিষ্কারের তথ্য প্রকাশিত হয়েছে।",
      },
    },
  },
];

// Helper to expand and generate full 64 seed stories
export function generateFullSeedStories(): Story[] {
  const fullList: Story[] = [];
  const baseTime = Date.now();

  // Create 8 variants per base item by perturbing region, timestamps, and velocity
  RAW_STORIES_DEFINITIONS.forEach((base, baseIndex) => {
    for (let variant = 0; variant < 8; variant++) {
      const storyId = `${base.id}-v${variant + 1}`;
      const publishedAt = baseTime - (base.publishedHoursAgo * 3600 * 1000 + variant * 7200 * 1000);
      const createdAt = publishedAt - 3600 * 1000;
      const velocity = Math.max(10, Math.min(100, base.velocityScore - variant * 4 + (variant % 3) * 5));

      // Rotate region for regional diversity
      const states = Object.keys(base.translations);
      const regionsList: Region[] = [
        { country: "India", state: "Maharashtra", city: "Mumbai" },
        { country: "India", state: "Karnataka", city: "Bengaluru" },
        { country: "India", state: "Tamil Nadu", city: "Chennai" },
        { country: "India", state: "Telangana", city: "Hyderabad" },
        { country: "India", state: "Delhi NCR", city: "New Delhi" },
        { country: "India", state: "West Bengal", city: "Kolkata" },
        { country: "India", state: "Uttar Pradesh", city: "Lucknow" },
        { country: "India", state: "Gujarat", city: "Ahmedabad" },
      ];
      const assignedRegion = regionsList[(baseIndex + variant) % regionsList.length];

      // Build story versions map for all 7 languages
      const versions: Record<string, any> = {};
      const languages: LanguageCode[] = ["en", "hi", "kn", "ta", "te", "mr", "bn"];

      languages.forEach((lang) => {
        const tr = base.translations[lang] || base.translations.en;
        const enTr = base.translations.en;
        let takeaways = tr.takeaways && tr.takeaways.length >= 3 ? tr.takeaways : [...(tr.takeaways || []), ...(enTr.takeaways || [])].slice(0, 3);
        if (takeaways.length < 3) {
          takeaways = ["Key development reported in region.", "Editorial verification completed.", "Further updates expected soon."];
        }
        let fullArticle = tr.fullArticle && tr.fullArticle.length >= 50 ? tr.fullArticle : `${tr.summary} ${enTr.fullArticle}`;

        versions[lang] = {
          language: lang,
          headline: variant === 0 ? tr.headline : `${tr.headline} (${assignedRegion.city} Edition)`,
          summary: tr.summary,
          fullArticle,
          takeaways: takeaways.slice(0, 5),
          motionSpec: {
            topic: base.motionSpec.topic,
            mood: base.motionSpec.mood,
            palette: GENRE_PALETTES[base.genre],
            motif: base.genre,
          },
          audioUrl: null,
          updatedAt: publishedAt,
        };
      });

      const story: Story = {
        id: storyId,
        originalLanguage: base.originalLanguage,
        genre: base.genre,
        region: assignedRegion,
        imageUrl: base.imageUrl,
        dominantColor: GENRE_DOMINANT[base.genre],
        source: {
          name: base.sourceName,
          url: base.sourceUrl,
        },
        author: {
          id: `author-${base.authorName.toLowerCase().replace(/\s+/g, "-")}`,
          name: base.authorName,
          role: base.authorRole,
        },
        status: "published",
        createdAt,
        publishedAt,
        velocityScore: velocity,
        versions,
      };

      fullList.push(story);
    }
  });

  return fullList;
}

export const SEED_STORIES = generateFullSeedStories();
