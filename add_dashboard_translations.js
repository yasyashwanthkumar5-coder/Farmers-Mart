const fs = require('fs');
const path = require('path');

const locales = {
  en: {
    admin: {
      dashboard: "Admin Dashboard",
      dashboard_desc: "Platform overview and key metrics.",
      total_users: "Total Users",
      active_listings: "Active Listings",
      pending_requests: "Pending Requests",
      total_revenue: "Total Revenue",
      quick_actions: "Quick Actions",
      manage_requests: "Mediate Purchase Requests",
      recent_activity: "Recent Activity",
      no_activity: "No recent activity found."
    }
  },
  hi: {
    admin: {
      dashboard: "एडमिन डैशबोर्ड",
      dashboard_desc: "प्लेटफ़ॉर्म अवलोकन और प्रमुख मेट्रिक्स।",
      total_users: "कुल उपयोगकर्ता",
      active_listings: "सक्रिय लिस्टिंग",
      pending_requests: "लंबित अनुरोध",
      total_revenue: "कुल राजस्व",
      quick_actions: "त्वरित कार्य",
      manage_requests: "खरीद अनुरोधों की मध्यस्थता करें",
      recent_activity: "हाल की गतिविधि",
      no_activity: "कोई हालिया गतिविधि नहीं मिली।"
    }
  },
  kn: {
    admin: {
      dashboard: "ನಿರ್ವಾಹಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      dashboard_desc: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅವಲೋಕನ ಮತ್ತು ಪ್ರಮುಖ ಮೆಟ್ರಿಕ್‌ಗಳು.",
      total_users: "ಒಟ್ಟು ಬಳಕೆದಾರರು",
      active_listings: "ಸಕ್ರಿಯ ಪಟ್ಟಿಗಳು",
      pending_requests: "ಬಾಕಿ ಉಳಿದಿರುವ ವಿನಂತಿಗಳು",
      total_revenue: "ಒಟ್ಟು ಆದಾಯ",
      quick_actions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
      manage_requests: "ಖರೀದಿ ವಿನಂತಿಗಳ ಮಧ್ಯಸ್ಥಿಕೆ",
      recent_activity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
      no_activity: "ಯಾವುದೇ ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ."
    }
  },
  te: {
    admin: {
      dashboard: "అడ్మిన్ డాష్‌బోర్డ్",
      dashboard_desc: "ప్లాట్‌ఫారమ్ అవలోకనం మరియు ముఖ్య కొలమానాలు.",
      total_users: "మొత్తం వినియోగదారులు",
      active_listings: "క్రియాశీల జాబితాలు",
      pending_requests: "పెండింగ్‌లో ఉన్న అభ్యర్థనలు",
      total_revenue: "మొత్తం ఆదాయం",
      quick_actions: "శీఘ్ర చర్యలు",
      manage_requests: "కొనుగోలు అభ్యర్థనల మధ్యవర్తిత్వం",
      recent_activity: "ఇటీవలి కార్యాచరణ",
      no_activity: "ఇటీవలి కార్యాచరణ కనుగొనబడలేదు."
    }
  },
  ta: {
    admin: {
      dashboard: "நிர்வாகி டாஷ்போர்டு",
      dashboard_desc: "மேடை மேலோட்டம் மற்றும் முக்கிய அளவீடுகள்.",
      total_users: "மொத்த பயனர்கள்",
      active_listings: "செயலில் உள்ள பட்டியல்கள்",
      pending_requests: "நிலுவையில் உள்ள கோரிக்கைகள்",
      total_revenue: "மொத்த வருவாய்",
      quick_actions: "விரைவான செயல்கள்",
      manage_requests: "கொள்முதல் கோரிக்கைகள் மத்தியஸ்தம்",
      recent_activity: "சமீபத்திய செயல்பாடு",
      no_activity: "சமீபத்திய செயல்பாடு எதுவும் கிடைக்கவில்லை."
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
    console.log(`Updated dashboard translations for ${lang}`);
  }
});
