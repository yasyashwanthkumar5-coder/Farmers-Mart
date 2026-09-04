const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');
const languages = fs.readdirSync(localesDir);

for (const lang of languages) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "5 to 10" with "1 to 10" in English
    content = content.replace(/5 to 10/g, '1 to 10');
    
    // Replace "5-10" with "1-10" in all languages
    content = content.replace(/5-10/g, '1-10');
    
    // Also check if any language has translated "5" explicitly for the "5 to 10 images required"
    // For safety, let's just replace 5 with 1 in specific lines if they exist, but 5-10 should catch it for non-English
    // Actually, let's just do a blanket replacement of 5 with 1 in the specific key.
    
    let json = JSON.parse(content);
    if (json.farmer && json.farmer.sell) {
      if (json.farmer.sell.images_required && typeof json.farmer.sell.images_required === 'string') {
        json.farmer.sell.images_required = json.farmer.sell.images_required.replace(/5/g, '1');
      }
      if (json.farmer.sell.alert_demo_image && typeof json.farmer.sell.alert_demo_image === 'string') {
        json.farmer.sell.alert_demo_image = json.farmer.sell.alert_demo_image.replace(/5-10/g, '1-10');
      }
    }
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log(`Updated ${lang}`);
  }
}
