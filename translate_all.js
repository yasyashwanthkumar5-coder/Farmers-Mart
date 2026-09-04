require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

const enPath = './src/locales/en/translation.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const langs = [
  { code: 'kn', name: 'Kannada' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'hi', name: 'Hindi' }
];

async function translate() {
  for (const lang of langs) {
    console.log(`Translating to ${lang.name}...`);
    const prompt = `Translate the following English JSON into ${lang.name}. 
    Return ONLY the raw JSON object, without any markdown formatting or \`\`\` tags. 
    Maintain the exact same keys and structure. Only translate the string values.
    
    JSON to translate:
    ${JSON.stringify(en, null, 2)}`;
    
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const translatedObj = JSON.parse(cleanJson);
      
      const outPath = `./src/locales/${lang.code}/translation.json`;
      fs.writeFileSync(outPath, JSON.stringify(translatedObj, null, 2));
      console.log(`Saved ${lang.code}/translation.json`);
    } catch (e) {
      console.error(`Failed to translate ${lang.name}:`, e);
    }
  }
}

translate();
