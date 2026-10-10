import { Story, LanguageCode } from "@/types";
import { QuizQuestion, QuizSet } from "./types";

const FALLBACK_QUESTIONS: Record<string, QuizQuestion[]> = {
  en: [
    {
      id: "fb-en-1",
      question: "Which major national mission was highlighted by ISRO for India's upcoming indigenous human spaceflight milestone?",
      options: ["Chandrayaan-4", "Gaganyaan", "Aditya-L2", "Mangalyaan-2"],
      correctIndex: 1,
      explanation: "ISRO's Gaganyaan project envisions demonstration of human spaceflight capability by launching human crew to an orbit of 400 km.",
      genre: "tech",
      pointsValue: 20,
      sourceHeadline: "ISRO advances astronaut training & capsule recovery tests for Gaganyaan",
    },
    {
      id: "fb-en-2",
      question: "Under India's Semiconductor Mission, which state inaugurates the Dholera semiconductor fabrication facility?",
      options: ["Karnataka", "Gujarat", "Maharashtra", "Tamil Nadu"],
      correctIndex: 1,
      explanation: "Tata Electronics in partnership with Powerchip Semiconductor Manufacturing Corp (PSMC) established India's pioneering commercial fab in Dholera, Gujarat.",
      genre: "markets",
      pointsValue: 20,
      sourceHeadline: "India Semiconductor Corridors accelerate fabrication milestones",
    },
    {
      id: "fb-en-3",
      question: "What target year has India set to achieve net-zero carbon emissions as part of its climate commitments?",
      options: ["2047", "2050", "2070", "2030"],
      correctIndex: 2,
      explanation: "India committed at COP26 to achieve Net-Zero greenhouse gas emissions by the year 2070 alongside 500GW non-fossil capacity by 2030.",
      genre: "weather",
      pointsValue: 20,
      sourceHeadline: "India Clean Energy transition pace expands solar and green hydrogen grid",
    },
    {
      id: "fb-en-4",
      question: "Which global financial institution retained India's GDP growth projection above 6.8% making it the fastest growing major economy?",
      options: ["World Bank", "IMF", "Asian Development Bank", "Federal Reserve"],
      correctIndex: 1,
      explanation: "The International Monetary Fund (IMF) and World Bank repeatedly reaffirmed India as the fastest-growing major world economy.",
      genre: "markets",
      pointsValue: 20,
      sourceHeadline: "IMF Economic Outlook reaffirms India's resilient economic momentum",
    },
    {
      id: "fb-en-5",
      question: "Which stadium hosted the high-stakes ICC marquee final with over 100,000 spectators?",
      options: ["Wankhede Stadium, Mumbai", "Narendra Modi Stadium, Ahmedabad", "Eden Gardens, Kolkata", "M. Chinnaswamy, Bengaluru"],
      correctIndex: 1,
      explanation: "Narendra Modi Stadium in Motera, Ahmedabad is the world's largest cricket stadium with a capacity of 132,000 spectators.",
      genre: "sports",
      pointsValue: 20,
      sourceHeadline: "World Cricket Finals record historic in-stadium attendance",
    },
  ],
  hi: [
    {
      id: "fb-hi-1",
      question: "इसरो (ISRO) के किस महत्वाकांक्षी मिशन का उद्देश्य भारतीय अंतरिक्ष यात्रियों को अंतरिक्ष में भेजना है?",
      options: ["चंद्रयान-4", "गगनयान", "आदित्य-एल2", "मंगलयान-2"],
      correctIndex: 1,
      explanation: "गगनयान मिशन का लक्ष्य 400 किमी की निचली पृथ्वी की कक्षा में 3 सदस्यीय दल को सुरक्षित भेजना और वापस लाना है।",
      genre: "tech",
      pointsValue: 20,
      sourceHeadline: "गगनयान मानव अंतरिक्ष उड़ान मिशन की तैयारियां तेज",
    },
    {
      id: "fb-hi-2",
      question: "भारत सेमीकंडक्टर मिशन के तहत पहला वाणिज्यिक फैब संयंत्र किस राज्य में स्थापित हो रहा है?",
      options: ["कर्नाटक", "गुजरात (धोलेरा)", "महाराष्ट्र", "उत्तर प्रदेश"],
      correctIndex: 1,
      explanation: "टाटा इलेक्ट्रॉनिक्स द्वारा गुजरात के धोलेरा में देश का पहला वाणिज्यिक सेमीकंडक्टर फैब स्थापित किया जा रहा है।",
      genre: "markets",
      pointsValue: 20,
      sourceHeadline: "गुजरात के धोलेरा में भारत का पहला सेमीकंडक्टर फैब",
    },
    {
      id: "fb-hi-3",
      question: "भारत ने किस वर्ष तक शून्य शुद्ध कार्बन उत्सर्जन (Net-Zero Emissions) का राष्ट्रीय लक्ष्य रखा है?",
      options: ["2047", "2050", "2070", "2030"],
      correctIndex: 2,
      explanation: "भारत ने सीओपी-26 (COP26) शिखर सम्मेलन में 2070 तक नेट-जीरो उत्सर्जन का संकल्प लिया है।",
      genre: "weather",
      pointsValue: 20,
      sourceHeadline: "हरित ऊर्जा व नेट-जीरो लक्ष्य की दिशा में भारत की प्रगति",
    },
    {
      id: "fb-hi-4",
      question: "अंतर्राष्ट्रीय मुद्रा कोष (IMF) के अनुसार दुनिया की सबसे तेजी से बढ़ती प्रमुख अर्थव्यवस्था कौन-सी है?",
      options: ["जर्मनी", "भारत", "जापान", "ब्राजील"],
      correctIndex: 1,
      explanation: "आईएमएफ (IMF) ने भारत को विश्व की सबसे तेजी से बढ़ती प्रमुख अर्थव्यवस्था घोषित किया है।",
      genre: "markets",
      pointsValue: 20,
      sourceHeadline: "वैश्विक विकास में भारत की मजबूत हिस्सेदारी बरकरार",
    },
    {
      id: "fb-hi-5",
      question: "1.3 लाख से अधिक दर्शकों की क्षमता वाला विश्व का सबसे बड़ा क्रिकेट स्टेडियम कौन-सा है?",
      options: ["वानखेड़े स्टेडियम", "नरेंद्र मोदी स्टेडियम, अहमदाबाद", "ईडन गार्डन्स", "चिन्नास्वामी स्टेडियम"],
      correctIndex: 1,
      explanation: "अहमदाबाद स्थित नरेंद्र मोदी स्टेडियम 1,32,000 की क्षमता वाला विश्व का सबसे बड़ा स्टेडियम है।",
      genre: "sports",
      pointsValue: 20,
      sourceHeadline: "विश्व का सबसे बड़ा क्रिकेट स्टेडियम बना खेल का प्रमुख केंद्र",
    },
  ],
};

/**
 * Generate a dynamic quiz set based on live stories or story spotlight
 */
export function generateQuizSet(params: {
  stories: Story[];
  language: LanguageCode;
  storyId?: string;
}): QuizSet {
  const { stories, language, storyId } = params;
  const langKey = language === "hi" ? "hi" : "en";
  const todayStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Scenario A: Focused single-story quiz
  if (storyId) {
    const targetStory = stories.find((s) => s.id === storyId);
    if (targetStory) {
      const version = targetStory.versions?.[language] || targetStory.versions?.en;
      if (version) {
        const headline = version.headline;
        const takeaways = version.takeaways || [];
        const region = targetStory.region.city || targetStory.region.state;
        const genre = targetStory.genre;

        const generated: QuizQuestion[] = [
          {
            id: `story-${storyId}-q1`,
            question: language === "hi" 
              ? `इस खबर का मुख्य विषय क्या है: "${headline.slice(0, 70)}..."?` 
              : `What is the core focus of the report: "${headline.slice(0, 75)}..."?`,
            options: [
              takeaways[0] || version.summary.slice(0, 60),
              "Unrelated speculation from social forums",
              "A routine meteorological administrative advisory",
              "An international travel visa guideline",
            ],
            correctIndex: 0,
            explanation: version.summary,
            sourceHeadline: headline,
            sourceUrl: targetStory.source.url,
            genre,
            pointsValue: 25,
            storyId,
          },
          {
            id: `story-${storyId}-q2`,
            question: language === "hi"
              ? `यह खबर किस क्षेत्र या प्रमुख शहर से संबंधित है?`
              : `Which key regional center or geographic hub is featured in this report?`,
            options: [
              region,
              region === "Mumbai" ? "Kolkata" : "Mumbai",
              region === "Bengaluru" ? "Chennai" : "Bengaluru",
              "Tokyo",
            ],
            correctIndex: 0,
            explanation: `This development originated from ${region}, India, validated via verified wire correspondents.`,
            sourceHeadline: headline,
            sourceUrl: targetStory.source.url,
            genre,
            pointsValue: 25,
            storyId,
          },
        ];

        if (takeaways.length >= 2) {
          generated.push({
            id: `story-${storyId}-q3`,
            question: language === "hi"
              ? `संपादकीय विश्लेषण के अनुसार कौन सा मुख्य तथ्य सही है?`
              : `According to the editorial brief, which of the following is an authorized takeaway?`,
            options: [
              "Total operational shutdown across all domestic units",
              takeaways[1],
              "Contradictory unsourced claims from unverified channels",
              "Immediate indefinite postponement of planned projects",
            ],
            correctIndex: 1,
            explanation: takeaways[1],
            sourceHeadline: headline,
            sourceUrl: targetStory.source.url,
            genre,
            pointsValue: 25,
            storyId,
          });
        }

        return {
          id: `spotlight-quiz-${storyId}`,
          title: language === "hi" ? "कहानी स्पॉटलाइट प्रश्नोत्तरी" : "Story Spotlight Quiz",
          description: headline,
          dateStamp: todayStr,
          questions: generated,
        };
      }
    }
  }

  // Scenario B: Dynamic quiz synthesized from live wire stories
  if (stories.length >= 3) {
    const dynamicQuestions: QuizQuestion[] = [];

    stories.slice(0, 5).forEach((story, idx) => {
      const ver = story.versions?.[language] || story.versions?.en;
      if (!ver) return;

      const otherStories = stories.filter((s) => s.id !== story.id);
      const fakeOption1 = otherStories[0]?.versions?.[language]?.headline || otherStories[0]?.versions?.en?.headline || "Global oil prices surge amid OPEC quota revisions";
      const fakeOption2 = otherStories[1]?.versions?.[language]?.headline || otherStories[1]?.versions?.en?.headline || "Monsoon rains advance early across peninsular India";
      const fakeOption3 = otherStories[2]?.versions?.[language]?.headline || otherStories[2]?.versions?.en?.headline || "Benchmark indices hit record highs on tech rally";

      const questionText = language === "hi"
        ? `हाल ही के समाचारों के अनुसार, ${story.source.name} द्वारा कौन-सी मुख्य घटना रिपोर्ट की गई?`
        : `According to live wire reporting from ${story.source.name}, what major development was verified in ${story.region.city}?`;

      const options = [ver.headline, fakeOption1, fakeOption2, fakeOption3];
      // Randomize position
      const correctIdx = (idx + 1) % 4;
      const temp = options[0];
      options[0] = options[correctIdx];
      options[correctIdx] = temp;

      dynamicQuestions.push({
        id: `wire-q-${story.id}`,
        question: questionText,
        options,
        correctIndex: correctIdx,
        explanation: ver.summary,
        sourceHeadline: ver.headline,
        sourceUrl: story.source.url,
        genre: story.genre,
        pointsValue: 20,
        storyId: story.id,
      });
    });

    if (dynamicQuestions.length >= 3) {
      return {
        id: `live-wire-quiz-${Date.now().toString(36)}`,
        title: language === "hi" ? "लाइव न्यूज़ प्रश्नोत्तरी · दैनिक एडिशन" : "Live News Wire Quiz · Daily Edition",
        description: language === "hi"
          ? "ज़ी मीडिया और सत्यापित लाइव वायर से सीधे तैयार की गई वास्तविक समय की प्रश्नोत्तरी।"
          : "Real-time news intelligence quiz generated directly from active Zee News wire briefs.",
        dateStamp: todayStr,
        questions: dynamicQuestions,
      };
    }
  }

  // Scenario C: Return verified fallback deck
  const questions = FALLBACK_QUESTIONS[langKey] || FALLBACK_QUESTIONS.en;
  return {
    id: `daily-top-quiz-${langKey}`,
    title: language === "hi" ? "दैनिक समसामयिकी प्रश्नोत्तरी" : "Current Affairs Daily News Quiz",
    description: language === "hi"
      ? "आज की शीर्ष राष्ट्रीय और अंतर्राष्ट्रीय सुर्खियों पर आधारित प्रश्नोत्तरी।"
      : "Daily curated news quiz testing your grasp on the most consequential national & global headlines.",
    dateStamp: todayStr,
    questions,
  };
}
