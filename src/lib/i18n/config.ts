import { LanguageCode } from "@/types";

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageMeta> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🌐",
    direction: "ltr",
    speechLang: "en-IN",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    direction: "ltr",
    speechLang: "hi-IN",
  },
  kn: {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    flag: "🇮🇳",
    direction: "ltr",
    speechLang: "kn-IN",
  },
  ta: {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    flag: "🇮🇳",
    direction: "ltr",
    speechLang: "ta-IN",
  },
  te: {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    flag: "🇮🇳",
    direction: "ltr",
    speechLang: "te-IN",
  },
  mr: {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    flag: "🇮🇳",
    direction: "ltr",
    speechLang: "mr-IN",
  },
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    flag: "🇮🇳",
    direction: "ltr",
    speechLang: "bn-IN",
  },
};

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function isValidLanguage(code: string): code is LanguageCode {
  return code in SUPPORTED_LANGUAGES;
}
