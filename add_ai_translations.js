const fs = require('fs');
const path = require('path');

const locales = {
  en: {
    thinking: "Thinking...",
    send: "Send",
    speak: "Speak",
    stop: "Stop",
    try_again: "Try again",
    voice_unavailable: "Voice input unavailable",
    clear_chat: "Clear chat",
    mute_voice_output: "Mute Voice Output",
    enable_voice_output: "Enable Voice Output",
    no_response: "No response",
    something_went_wrong: "Something went wrong"
  },
  hi: {
    thinking: "सोच रहा है...",
    send: "भेजें",
    speak: "बोलें",
    stop: "रुकें",
    try_again: "पुनः प्रयास करें",
    voice_unavailable: "ध्वनि इनपुट अनुपलब्ध",
    clear_chat: "चैट साफ़ करें",
    mute_voice_output: "आवाज़ म्यूट करें",
    enable_voice_output: "आवाज़ सक्षम करें",
    no_response: "कोई प्रतिक्रिया नहीं",
    something_went_wrong: "कुछ गलत हो गया"
  },
  kn: {
    thinking: "ಆಲೋಚಿಸುತ್ತಿದೆ...",
    send: "ಕಳುಹಿಸಿ",
    speak: "ಮಾತನಾಡಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    try_again: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    voice_unavailable: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ",
    clear_chat: "ಚಾಟ್ ಅಳಿಸಿ",
    mute_voice_output: "ಧ್ವನಿ ಮ್ಯೂಟ್ ಮಾಡಿ",
    enable_voice_output: "ಧ್ವನಿ ಸಕ್ರಿಯಗೊಳಿಸಿ",
    no_response: "ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ಇಲ್ಲ",
    something_went_wrong: "ಏನೋ ತಪ್ಪಾಗಿದೆ"
  },
  te: {
    thinking: "ఆలోచిస్తోంది...",
    send: "పంపండి",
    speak: "మాట్లాడండి",
    stop: "ఆపండి",
    try_again: "మళ్లీ ప్రయత్నించండి",
    voice_unavailable: "వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు",
    clear_chat: "చాట్ క్లియర్ చేయండి",
    mute_voice_output: "వాయిస్ మ్యూట్ చేయండి",
    enable_voice_output: "వాయిస్ ఆన్ చేయండి",
    no_response: "స్పందన లేదు",
    something_went_wrong: "ఏదో తప్పు జరిగింది"
  },
  ta: {
    thinking: "யோசிக்கிறது...",
    send: "அனுப்பு",
    speak: "பேசு",
    stop: "நிறுத்து",
    try_again: "மீண்டும் முயற்சிக்கவும்",
    voice_unavailable: "குரல் உள்ளீடு கிடைக்கவில்லை",
    clear_chat: "அரட்டையை அழி",
    mute_voice_output: "குரலை முடக்கு",
    enable_voice_output: "குரலை இயக்கு",
    no_response: "பதிலில்லை",
    something_went_wrong: "ஏதோ தவறு நடந்துவிட்டது"
  }
};

const localesDir = path.join(__dirname, 'src/locales');

Object.keys(locales).forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!json.ai) json.ai = {};
    
    // Merge new keys
    json.ai = { ...json.ai, ...locales[lang] };
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log(`Updated translations for ${lang}`);
  }
});
