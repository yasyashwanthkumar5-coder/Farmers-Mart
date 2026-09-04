const fs = require('fs');
const path = require('path');

const locales = {
  en: {
    admin: {
      logistics: "Logistics Dashboard",
      logistics_desc: "Monitor active shipping routes, track in-transit orders, and manage deliveries.",
      active_deliveries: "Active Deliveries",
      total_logistics_revenue: "Total Delivery Fees",
      route: "Shipping Route",
      pickup: "Pickup (Farmer)",
      dropoff: "Dropoff (Buyer)",
      no_deliveries: "No active deliveries in transit.",
      mark_delivered_confirm: "Confirm delivery for order "
    }
  },
  hi: {
    admin: {
      logistics: "लॉजिस्टिक्स डैशबोर्ड",
      logistics_desc: "सक्रिय शिपिंग मार्गों की निगरानी करें, पारगमन आदेशों को ट्रैक करें, और डिलीवरी प्रबंधित करें।",
      active_deliveries: "सक्रिय डिलीवरी",
      total_logistics_revenue: "कुल डिलीवरी शुल्क",
      route: "शिपिंग मार्ग",
      pickup: "पिकअप (किसान)",
      dropoff: "ड्रॉपऑफ़ (क्रेता)",
      no_deliveries: "पारगमन में कोई सक्रिय डिलीवरी नहीं है।",
      mark_delivered_confirm: "ऑर्डर के लिए डिलीवरी की पुष्टि करें "
    }
  },
  kn: {
    admin: {
      logistics: "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      logistics_desc: "ಸಕ್ರಿಯ ಹಡಗು ಮಾರ್ಗಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ, ಸಾಗಣೆಯಲ್ಲಿರುವ ಆದೇಶಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ವಿತರಣೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
      active_deliveries: "ಸಕ್ರಿಯ ವಿತರಣೆಗಳು",
      total_logistics_revenue: "ಒಟ್ಟು ವಿತರಣಾ ಶುಲ್ಕಗಳು",
      route: "ಹಡಗು ಮಾರ್ಗ",
      pickup: "ಪಿಕಪ್ (ರೈತ)",
      dropoff: "ಡ್ರಾಪ್‌ಆಫ್ (ಖರೀದಿದಾರ)",
      no_deliveries: "ಸಾಗಣೆಯಲ್ಲಿ ಯಾವುದೇ ಸಕ್ರಿಯ ವಿತರಣೆಗಳಿಲ್ಲ.",
      mark_delivered_confirm: "ಆರ್ಡರ್‌ಗಾಗಿ ವಿತರಣೆಯನ್ನು ದೃಢೀಕರಿಸಿ "
    }
  },
  te: {
    admin: {
      logistics: "లాజిస్టిక్స్ డాష్‌బోర్డ్",
      logistics_desc: "క్రియాశీల షిప్పింగ్ మార్గాలను పర్యవేక్షించండి, రవాణాలో ఉన్న ఆర్డర్‌లను ట్రాక్ చేయండి మరియు డెలివరీలను నిర్వహించండి.",
      active_deliveries: "క్రియాశీల డెలివరీలు",
      total_logistics_revenue: "మొత్తం డెలివరీ ఫీజులు",
      route: "షిప్పింగ్ మార్గం",
      pickup: "పికప్ (రైతు)",
      dropoff: "డ్రాప్ఆఫ్ (కొనుగోలుదారు)",
      no_deliveries: "రవాణాలో క్రియాశీల డెలివరీలు లేవు.",
      mark_delivered_confirm: "ఆర్డర్ కోసం డెలివరీని నిర్ధారించండి "
    }
  },
  ta: {
    admin: {
      logistics: "தளவாடங்கள் டாஷ்போர்டு",
      logistics_desc: "செயலில் உள்ள கப்பல் வழிகளை கண்காணிக்கவும், போக்குவரத்தில் உள்ள ஆர்டர்களை கண்காணிக்கவும் மற்றும் விநியோகங்களை நிர்வகிக்கவும்.",
      active_deliveries: "செயலில் உள்ள விநியோகங்கள்",
      total_logistics_revenue: "மொத்த விநியோக கட்டணம்",
      route: "கப்பல் பாதை",
      pickup: "பிக்கப் (விவசாயி)",
      dropoff: "டிராப்-ஆஃப் (வாங்குபவர்)",
      no_deliveries: "போக்குவரத்தில் செயலில் உள்ள விநியோகங்கள் எதுவும் இல்லை.",
      mark_delivered_confirm: "ஆர்டருக்கான விநியோகத்தை உறுதிப்படுத்தவும் "
    }
  }
};

const localesDir = path.join(__dirname, 'src/locales');

Object.keys(locales).forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!json.admin) json.admin = {};
    
    json.admin = { ...json.admin, ...locales[lang].admin };
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log(`Updated logistics translations for ${lang}`);
  }
});
