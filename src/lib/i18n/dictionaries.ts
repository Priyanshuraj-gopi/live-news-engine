import { LanguageCode } from "@/types";
import { DEFAULT_LANGUAGE } from "./config";

export interface Dictionary {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    feed: string;
    trending: string;
    debate: string;
    upload: string;
    admin: string;
    profile: string;
    login: string;
    logout: string;
  };
  feed: {
    readFull: string;
    summary: string;
    takeaways: string;
    audioSummary: string;
    videoSummary: string;
    listenAudio: string;
    playingAudio: string;
    pauseAudio: string;
    share: string;
    minutesAgo: string;
    hoursAgo: string;
    source: string;
    swipeUp: string;
    swipeDown: string;
  };
  genres: Record<string, string>;
  credibility: {
    title: string;
    score: string;
    level: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
    readingStreak: string;
    debateQuality: string;
    peerHelpful: string;
  };
  debate: {
    title: string;
    placeholder: string;
    send: string;
    slowMode: string;
    toxicityNotice: string;
    noMessages: string;
  };
  admin: {
    contentIntelligence: string;
    predictedInterest: string;
    channelRecommendation: string;
    monetisationPrediction: string;
    syndicationExport: string;
  };
}

export const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  en: {
    appName: "NewsEngine",
    tagline: "Multilingual Intelligence & Realtime News Platform",
    nav: {
      home: "Home",
      feed: "Shorts Feed",
      trending: "Trending",
      debate: "Live Debates",
      upload: "Submit Story",
      admin: "Editorial Intelligence",
      profile: "Credibility Profile",
      login: "Sign In",
      logout: "Sign Out",
    },
    feed: {
      readFull: "Read Full Story",
      summary: "AI 60-Word Brief",
      takeaways: "Key Takeaways",
      audioSummary: "Audio Summary",
      videoSummary: "AI Video Summary",
      listenAudio: "Listen",
      playingAudio: "Playing...",
      pauseAudio: "Pause",
      share: "Share Story",
      minutesAgo: "m ago",
      hoursAgo: "h ago",
      source: "Source",
      swipeUp: "Swipe up for next story",
      swipeDown: "Swipe down for previous",
    },
    genres: {
      sports: "Sports",
      politics: "Politics",
      markets: "Markets & Economy",
      weather: "Weather",
      tech: "Technology",
      entertainment: "Entertainment",
      crime: "Crime & Law",
      health: "Health & Science",
    },
    credibility: {
      title: "Reader Credibility Score",
      score: "Credibility Score",
      level: "Rank Level",
      level1: "Novice Reader",
      level2: "Verified Observer",
      level3: "Active Contributor",
      level4: "Analytical Critic",
      level5: "Luminary Scholar",
      readingStreak: "Reading Dwell Time",
      debateQuality: "Debate Civility & Rigor",
      peerHelpful: "Peer Endorsements",
    },
    debate: {
      title: "Live Story Debate",
      placeholder: "Share your perspective respectfully...",
      send: "Debate",
      slowMode: "Slow mode active: 1 message every 30s",
      toxicityNotice: "Comments are screened via Gemini AI moderation for civility.",
      noMessages: "No perspectives shared yet. Be the first to spark the debate!",
    },
    admin: {
      contentIntelligence: "Content Intelligence & Monetisation",
      predictedInterest: "Predicted Audience Segment Affinity",
      channelRecommendation: "Optimal Syndication Channels",
      monetisationPrediction: "Projected Yield & Monetisation Route",
      syndicationExport: "Manus Automation JSON Feed",
    },
  },
  hi: {
    appName: "न्यूज़इंजन",
    tagline: "बहुभाषी बुद्धिमत्ता और वास्तविक समय समाचार मंच",
    nav: {
      home: "होम",
      feed: "शॉर्ट्स फ़ीड",
      trending: "ट्रेंडिंग",
      debate: "लाइव बहस",
      upload: "कहानी भेजें",
      admin: "संपादकीय बुद्धिमत्ता",
      profile: "विश्वसनीयता प्रोफाइल",
      login: "साइन इन",
      logout: "साइन आउट",
    },
    feed: {
      readFull: "पूरी खबर पढ़ें",
      summary: "एआई 60-शब्द संक्षेप",
      takeaways: "मुख्य बिंदु",
      audioSummary: "ऑडियो सारांश",
      videoSummary: "एआई वीडियो सारांश",
      listenAudio: "सुनें",
      playingAudio: "चल रहा है...",
      pauseAudio: "रोकें",
      share: "साझा करें",
      minutesAgo: "मिनट पहले",
      hoursAgo: "घंटे पहले",
      source: "स्रोत",
      swipeUp: "अगली खबर के लिए ऊपर स्वाइप करें",
      swipeDown: "पिछली खबर के लिए नीचे स्वाइप करें",
    },
    genres: {
      sports: "खेल",
      politics: "राजनीति",
      markets: "बाज़ार और अर्थव्यवस्था",
      weather: "मौसम",
      tech: "प्रौद्योगिकी",
      entertainment: "मनोरंजन",
      crime: "अपराध और कानून",
      health: "स्वास्थ्य और विज्ञान",
    },
    credibility: {
      title: "पाठक विश्वसनीयता स्कोर",
      score: "विश्वसनीयता स्कोर",
      level: "रैंक स्तर",
      level1: "नवागंतुक पाठक",
      level2: "सत्यापित प्रेक्षक",
      level3: "सक्रिय योगदानकर्ता",
      level4: "विश्लेषणात्मक समीक्षक",
      level5: "प्रकाशपुंज विद्वान",
      readingStreak: "सक्रिय पठन समय",
      debateQuality: "बहस गुणवत्ता व शिष्टाचार",
      peerHelpful: "साथी पाठकों की अनुशंसा",
    },
    debate: {
      title: "लाइव विचार-विमर्श",
      placeholder: "अपना दृष्टिकोण शिष्टता से साझा करें...",
      send: "भेजें",
      slowMode: "धीमा मोड सक्रिय: हर 30 सेकंड में 1 संदेश",
      toxicityNotice: "टिप्पणियों की निगरानी जेमिनी एआई द्वारा की जाती है।",
      noMessages: "अभी कोई संदेश नहीं है। संवाद शुरू करें!",
    },
    admin: {
      contentIntelligence: "सामग्री बुद्धिमत्ता और मुद्रीकरण",
      predictedInterest: "अनुमानित दर्शक रुचि",
      channelRecommendation: "सर्वोत्तम सिंडिकेशन चैनल",
      monetisationPrediction: "अनुमानित उपज और मुद्रीकरण",
      syndicationExport: "मानस ऑटोमेशन JSON फ़ीड",
    },
  },
  kn: {
    appName: "ನ್ಯೂಸ್ ಇಂಜಿನ್",
    tagline: "ಬಹುಭಾಷಾ ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ನೇರ ಸುದ್ದಿ ವೇದಿಕೆ",
    nav: {
      home: "ಮುಖಪುಟ",
      feed: "ಕಿರು ಸುದ್ದಿ",
      trending: "ಟ್ರೆಂಡಿಂಗ್",
      debate: "ನೇರ ಚರ್ಚೆ",
      upload: "ಸುದ್ದಿ ಸಲ್ಲಿಸಿ",
      admin: "ಸಂಪಾದಕೀಯ ವಿಶ್ಲೇಷಣೆ",
      profile: "ವಿಶ್ವಾಸಾರ್ಹತೆ ಪ್ರೊಫೈಲ್",
      login: "ಲಾಗಿನ್",
      logout: "ಲಾಗೌಟ್",
    },
    feed: {
      readFull: "ಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ",
      summary: "AI ೬೦ ಪದಗಳ ಸಾರಾಂಶ",
      takeaways: "ಪ್ರಮುಖ ಅಂಶಗಳು",
      audioSummary: "ಆಡಿಯೋ ಸಾರಾಂಶ",
      videoSummary: "AI ವೀಡಿಯೊ ಸಾರಾಂಶ",
      listenAudio: "ಆಲಿಸಿ",
      playingAudio: "ಪ್ಲೇ ಆಗುತ್ತಿದೆ...",
      pauseAudio: "ವಿರಾಮ",
      share: "ಹಂಚಿಕೊಳ್ಳಿ",
      minutesAgo: "ನಿಮಿಷಗಳ ಹಿಂದೆ",
      hoursAgo: "ಗಂಟೆಗಳ ಹಿಂದೆ",
      source: "ಮೂಲ",
      swipeUp: "ಮುಂದಿನ ಸುದ್ದಿಗೆ ಮೇಲಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ",
      swipeDown: "ಹಿಂದಿನ ಸುದ್ದಿಗೆ ಕೆಳಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ",
    },
    genres: {
      sports: "ಕ್ರೀಡೆ",
      politics: "ರಾಜಕೀಯ",
      markets: "ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಆರ್ಥಿಕತೆ",
      weather: "ಹವಾಮಾನ",
      tech: "ತಂತ್ರಜ್ಞಾನ",
      entertainment: "ಮನರಂಜನೆ",
      crime: "ಅಪರಾಧ ಮತ್ತು ಕಾನೂನು",
      health: "ಆರೋಗ್ಯ ಮತ್ತು ವಿಜ್ಞಾನ",
    },
    credibility: {
      title: "ಓದುಗರ ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್",
      score: "ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್",
      level: "ಹಂತ",
      level1: "ಹೊಸ ಓದುಗ",
      level2: "ಪರಿಶೀಲಿತ ವೀಕ್ಷಕ",
      level3: "ಸಕ್ರಿಯ ಕೊಡುಗೆದಾರ",
      level4: "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವಿಮರ್ಶಕ",
      level5: "ಶ್ರೇಷ್ಠ ವಿದ್ವಾಂಸ",
      readingStreak: "ಓದುವ ಸಕ್ರಿಯ ಸಮಯ",
      debateQuality: "ಚರ್ಚೆಯ ಗುಣಮಟ್ಟ",
      peerHelpful: "ಸಹ ಓದುಗರ ಬೆಂಬಲ",
    },
    debate: {
      title: "ನೇರ ಸುದ್ದಿ ಚರ್ಚೆ",
      placeholder: "ನಿಮ್ಮ ಅನಿಸಿಕೆಯನ್ನು ಗೌರವಯುತವಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ...",
      send: "ಕಳುಹಿಸಿ",
      slowMode: "ಸ್ಲೋ ಮೋಡ್ ಸಕ್ರಿಯ",
      toxicityNotice: "ಕಾಮೆಂಟ್‌ಗಳನ್ನು Gemini AI ಮೂಲಕ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
      noMessages: "ಇನ್ನೂ ಯಾವುದೇ ಚರ್ಚೆ ಆರಂಭವಾಗಿಲ್ಲ. ನೀವೇ ಮೊದಲಿಗರಾಗಿ!",
    },
    admin: {
      contentIntelligence: "ವಿಷಯ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಆದಾಯ ಗಳಿಕೆ",
      predictedInterest: "ನಿರೀಕ್ಷಿತ ವೀಕ್ಷಕರ ಆಸಕ್ತಿ",
      channelRecommendation: "ಸೂಕ್ತ ಸಿಂಡಿಕೇಶನ್ ಮಾಧ್ಯಮಗಳು",
      monetisationPrediction: "ನಿರೀಕ್ಷಿತ ಆದಾಯ ಮಾರ್ಗ",
      syndicationExport: "Manus Automation JSON ಫೀಡ್",
    },
  },
  ta: {
    appName: "நியூஸ் எஞ்சின்",
    tagline: "பன்மொழி நுண்ணறிவு மற்றும் நேரலை செய்தி தளம்",
    nav: {
      home: "முகப்பு",
      feed: "குறுஞ்செய்தி",
      trending: "பிரபலமானவை",
      debate: "நேரலை விவாதம்",
      upload: "செய்தி சமர்ப்பிக்க",
      admin: "ஆசிரியர் நுண்ணறிவு",
      profile: "நம்பகத்தன்மை சுயவிவரம்",
      login: "உள்நுழைக",
      logout: "வெளியேறுக",
    },
    feed: {
      readFull: "முழு செய்தியையும் படிக்கவும்",
      summary: "AI 60-சொல் சுருக்கம்",
      takeaways: "முக்கிய குறிப்புகள்",
      audioSummary: "ஆடியோ சுருக்கம்",
      videoSummary: "AI வீடியோ சுருக்கம்",
      listenAudio: "கேட்கவும்",
      playingAudio: "ஒலிக்கிறது...",
      pauseAudio: "இடைநிறுத்து",
      share: "பகிரவும்",
      minutesAgo: "நிமிடங்களுக்கு முன்",
      hoursAgo: "மணிநேரங்களுக்கு முன்",
      source: "மூலம்",
      swipeUp: "அடுத்த செய்திக்கு மேலே ஸ்வைப் செய்யவும்",
      swipeDown: "முந்தைய செய்திக்கு கீழே ஸ்வைப் செய்யவும்",
    },
    genres: {
      sports: "விளையாட்டு",
      politics: "அரசியல்",
      markets: "சந்தை & பொருளாதாரம்",
      weather: "வானிலை",
      tech: "தொழில்நுட்பம்",
      entertainment: "பொழுதுபோக்கு",
      crime: "குற்றம் & சட்டம்",
      health: "சுகாதாரம் & அறிவியல்",
    },
    credibility: {
      title: "வாசகர் நம்பகத்தன்மை மதிப்பீடு",
      score: "நம்பகத்தன்மை புள்ளி",
      level: "தகுதி நிலை",
      level1: "புதிய வாசகர்",
      level2: "சரிபார்க்கப்பட்ட பார்வையாளர்",
      level3: "செயல்பாட்டு பங்களிப்பாளர்",
      level4: "ஆய்வு விமர்சகர்",
      level5: "முன்னணி அறிஞர்",
      readingStreak: "வாசிப்பு நேரம்",
      debateQuality: "விவாத நாகரிகம்",
      peerHelpful: "தோழர்களின் பாராட்டு",
    },
    debate: {
      title: "நேரலை விவாதம்",
      placeholder: "உங்கள் கருத்தை மரியாதையுடன் பகிரவும்...",
      send: "அனுப்பு",
      slowMode: "மெதுவான முறை இயக்கத்தில் உள்ளது",
      toxicityNotice: "கருத்துகள் Gemini AI மூலம் கண்காணிக்கப்படுகின்றன.",
      noMessages: "இன்னும் கருத்துகள் இல்லை. முதலில் தொடங்குங்கள்!",
    },
    admin: {
      contentIntelligence: "உள்ளடக்க நுண்ணறிவு & பணமாக்குதல்",
      predictedInterest: "பார்வையாளர் விருப்ப கணிப்பு",
      channelRecommendation: "சிறந்த பகிர்வு சேனல்கள்",
      monetisationPrediction: "வருவாய் கணிப்பு",
      syndicationExport: "Manus Automation JSON Feed",
    },
  },
  te: {
    appName: "న్యూస్ ఇంజిన్",
    tagline: "బహుభాషా మేధస్సు మరియు ప్రత్యక్ష వార్తా వేదిక",
    nav: {
      home: "హోమ్",
      feed: "షార్ట్స్ ఫీడ్",
      trending: "ట్రెండింగ్",
      debate: "లైవ్ చర్చ",
      upload: "వార్త పంపండి",
      admin: "ఎడిటోరియల్ ఇంటెలిజెన్స్",
      profile: "విశ్వసనీయత ప్రొఫైల్",
      login: "లాగిన్",
      logout: "లాగౌట్",
    },
    feed: {
      readFull: "పూర్తి వార్త చదవండి",
      summary: "AI 60 పదాల సారాంశం",
      takeaways: "ముఖ్య అంశాలు",
      audioSummary: "ఆడియో సారాంశం",
      videoSummary: "AI వీడియో సారాంశం",
      listenAudio: "వినండి",
      playingAudio: "ప్లే అవుతోంది...",
      pauseAudio: "పాజ్",
      share: "షేర్ చేయండి",
      minutesAgo: "నిమిషాల క్రితం",
      hoursAgo: "గంటల క్రితం",
      source: "మూలం",
      swipeUp: "తదుపరి వార్త కోసం పైకి స్వైప్ చేయండి",
      swipeDown: "మునుపటి వార్త కోసం కిందకి స్వైప్ చేయండి",
    },
    genres: {
      sports: "క్రీడలు",
      politics: "రాజకీయాలు",
      markets: "మార్కెట్లు & ఆర్థికం",
      weather: "వాతావరణం",
      tech: "టెక్నాలజీ",
      entertainment: "వినోదం",
      crime: "నేరాలు & చట్టం",
      health: "ఆరోగ్యం & సైన్స్",
    },
    credibility: {
      title: "పాఠకుల విశ్వసనీయత స్కోర్",
      score: "విశ్వసనీయత స్కోర్",
      level: "ర్యాంక్ స్థాయి",
      level1: "ప్రారంభ పాఠకుడు",
      level2: "ధృవీకరించబడిన పరిశీలకుడు",
      level3: "క్రియాశీల సహకారి",
      level4: "విశ్లేషణాత్మక విమర్శకుడు",
      level5: "మేధావి",
      readingStreak: "చదివిన సమయం",
      debateQuality: "చర్చా నాణ్యత",
      peerHelpful: "తోటి పాఠకుల ప్రశంసలు",
    },
    debate: {
      title: "ప్రత్యక్ష వార్తా చర్చ",
      placeholder: "మీ అభిప్రాయాన్ని మర్యాదపూర్వకంగా పంచుకోండి...",
      send: "పంపండి",
      slowMode: "స్లో మోడ్ ఆన్‌లో ఉంది",
      toxicityNotice: "వ్యాఖ్యలు Gemini AI ద్వారా పర్యవేక్షించబడతాయి.",
      noMessages: "ఇంకా వ్యాఖ్యలు లేవు. మీరే చర్చను ప్రారంభించండి!",
    },
    admin: {
      contentIntelligence: "కంటెంట్ ఇంటెలిజెన్స్ & మానిటైజేషన్",
      predictedInterest: "ప్రేక్షకుల ఆసక్తి అంచనా",
      channelRecommendation: "సిండికేషన్ ఛానెల్‌లు",
      monetisationPrediction: "ఆదాయ అంచనా",
      syndicationExport: "Manus Automation JSON Feed",
    },
  },
  mr: {
    appName: "न्यूज इंजिन",
    tagline: "बहुभाषिक बुद्धिमत्ता आणि थेट बातम्यांचे व्यासपीठ",
    nav: {
      home: "मुख्यपृष्ठ",
      feed: "शॉर्ट्स फीड",
      trending: "ट्रेंडिंग",
      debate: "थेट चर्चा",
      upload: "बातमी पाठवा",
      admin: "संपादकीय विश्लेषण",
      profile: "विश्वसनीयता प्रोफाइल",
      login: "साइन इन",
      logout: "साइन आउट",
    },
    feed: {
      readFull: "संपूर्ण बातमी वाचा",
      summary: "AI ६०-शब्द सारांश",
      takeaways: "महत्त्वाचे मुद्दे",
      audioSummary: "ऑडिओ सारांश",
      videoSummary: "AI व्हिडिओ सारांश",
      listenAudio: "ऐका",
      playingAudio: "सुरू आहे...",
      pauseAudio: "थांबवा",
      share: "शेअर करा",
      minutesAgo: "मिनिटांपूर्वी",
      hoursAgo: "तासांपूर्वी",
      source: "स्रोत",
      swipeUp: "पुढील बातमीसाठी वर स्वाइप करा",
      swipeDown: "मागील बातमीसाठी खाली स्वाइप करा",
    },
    genres: {
      sports: "क्रीडा",
      politics: "राजकारण",
      markets: "बाजार आणि अर्थव्यवस्था",
      weather: "हवामान",
      tech: "तंत्रज्ञान",
      entertainment: "मनोरंजन",
      crime: "गुन्हेगारी आणि कायदा",
      health: "आरोग्य आणि विज्ञान",
    },
    credibility: {
      title: "वाचक विश्वसनीयता गुण",
      score: "विश्वसनीयता गुण",
      level: "श्रेणी स्तर",
      level1: "नवशिक्या वाचक",
      level2: "प्रमाणित निरीक्षक",
      level3: "सक्रिय योगदानकर्ता",
      level4: "विश्लेषक समीक्षक",
      level5: "मार्गदर्शक विचारवंत",
      readingStreak: "सक्रिय वाचन वेळ",
      debateQuality: "चर्चेचा स्तर आणि सभ्यता",
      peerHelpful: "सहकाऱ्यांची प्रशंसा",
    },
    debate: {
      title: "थेट बातमी चर्चा",
      placeholder: "आपले मत आदराने मांडा...",
      send: "पाठवा",
      slowMode: "स्लो मोड सक्रिय",
      toxicityNotice: "टिप्पण्यांवर Gemini AI द्वारे देखरेख ठेवली जाते.",
      noMessages: "अद्याप कोणतीही चर्चा नाही. पहिली टिप्पणी करा!",
    },
    admin: {
      contentIntelligence: "सामग्री बुद्धिमत्ता आणि कमाई",
      predictedInterest: "अपेक्षित वाचक कल",
      channelRecommendation: "सर्वोत्तम वितरण वाहिन्या",
      monetisationPrediction: "कमाईचा अंदाज",
      syndicationExport: "Manus Automation JSON Feed",
    },
  },
  bn: {
    appName: "নিউজ ইঞ্জিন",
    tagline: "বহুভাষিক বুদ্ধিমত্তা ও লাইভ সংবাদ প্ল্যাটফর্ম",
    nav: {
      home: "হোম",
      feed: "শর্টস ফিড",
      trending: "ট্রেন্ডিং",
      debate: "লাইভ বিতর্ক",
      upload: "সংবাদ জমা দিন",
      admin: "সম্পাদকীয় গোয়েন্দা তথ্য",
      profile: "বিশ্বাসযোগ্যতা প্রোফাইল",
      login: "সাইন ইন",
      logout: "সাইন আউট",
    },
    feed: {
      readFull: "সম্পূর্ণ খবর পড়ুন",
      summary: "AI ৬০-শব্দের সারাংশ",
      takeaways: "মূল বিষয়সমূহ",
      audioSummary: "অডিও সারাংশ",
      videoSummary: "AI ভিডিও সারাংশ",
      listenAudio: "শুনুন",
      playingAudio: "চলছে...",
      pauseAudio: "থামান",
      share: "শেয়ার করুন",
      minutesAgo: "মিনিট আগে",
      hoursAgo: "ঘণ্টা আগে",
      source: "উৎস",
      swipeUp: "পরবর্তী খবরের জন্য উপরে সোয়াইপ করুন",
      swipeDown: "পূর্ববর্তী খবরের জন্য নিচে সোয়াইপ করুন",
    },
    genres: {
      sports: "খেলাধুলা",
      politics: "রাজনীতি",
      markets: "বাজার ও অর্থনীতি",
      weather: "আবহাওয়া",
      tech: "প্রযুক্তি",
      entertainment: "বিনোদন",
      crime: "অপরাধ ও আইন",
      health: "স্বাস্থ্য ও বিজ্ঞান",
    },
    credibility: {
      title: "পাঠক বিশ্বাসযোগ্যতা স্কোর",
      score: "বিশ্বাসযোগ্যতা স্কোর",
      level: "পদমর্যাদা স্তর",
      level1: "নবাগত পাঠক",
      level2: "যাচাইকৃত পর্যবেক্ষক",
      level3: "সক্রিয় অবদানকারী",
      level4: "বিশ্লেষণমূলক সমালোচক",
      level5: "দীপ্তিমান পণ্ডিত",
      readingStreak: "পড়ার সক্রিয় সময়",
      debateQuality: "বিতর্কের মান ও শালীনতা",
      peerHelpful: "সহপাঠকদের প্রশংসা",
    },
    debate: {
      title: "লাইভ সংবাদ বিতর্ক",
      placeholder: "আপনার মতামত শ্রদ্ধার সাথে শেয়ার করুন...",
      send: "পাঠান",
      slowMode: "ধীর মোড সক্রিয়",
      toxicityNotice: "মন্তব্যগুলি Gemini AI দ্বারা নিরীক্ষণ করা হয়।",
      noMessages: "এখনও কোনও মন্তব্য নেই। আলোচনা শুরু করতে প্রথম হোন!",
    },
    admin: {
      contentIntelligence: "কন্টেন্ট ইন্টেলিজেন্স ও নগদীকরণ",
      predictedInterest: "অনুমানিত পাঠক পছন্দ",
      channelRecommendation: "সেরা সিন্ডিকেট চ্যানেল",
      monetisationPrediction: "রাজস্ব পূর্বাভাস",
      syndicationExport: "Manus Automation JSON Feed",
    },
  },
};

export function getDictionary(lang: LanguageCode = DEFAULT_LANGUAGE): Dictionary {
  return DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANGUAGE];
}
