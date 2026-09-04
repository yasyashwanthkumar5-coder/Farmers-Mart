const fs = require('fs');
const path = require('path');

const locales = {
  en: {
    buyer: {
      my_orders: "My Orders",
      track_orders: "Track your produce purchases.",
      status_purchase_requested: "Purchase Requested",
      status_pending_admin: "Pending Admin Approval",
      status_accepted: "Accepted",
      status_in_transit: "Delivery in Process",
      status_delivered: "Delivered",
      status_rejected: "Rejected",
      order_details: "Order Details",
      billing: "Billing",
      timeline: "Status Timeline",
      no_orders: "You have not placed any orders yet.",
      seller: "Farmer / Seller",
      order_date: "Order Date",
      rejected_reason: "Reason",
      request_sent_msg: "Your purchase request has been sent to AgriMart administration. You will be notified when it is approved or rejected.",
      request_rejected_msg: "Your purchase request was rejected by the administrator.",
      delivery_details: "Delivery Details"
    }
  },
  hi: {
    buyer: {
      my_orders: "मेरे आदेश",
      track_orders: "अपनी उपज खरीद को ट्रैक करें।",
      status_purchase_requested: "खरीद का अनुरोध किया गया",
      status_pending_admin: "व्यवस्थापक अनुमोदन लंबित",
      status_accepted: "स्वीकृत",
      status_in_transit: "वितरण प्रक्रिया में",
      status_delivered: "वितरित",
      status_rejected: "अस्वीकृत",
      order_details: "आदेश विवरण",
      billing: "बिलिंग",
      timeline: "स्थिति समयरेखा",
      no_orders: "आपने अभी तक कोई आदेश नहीं दिया है।",
      seller: "किसान / विक्रेता",
      order_date: "आदेश तिथि",
      rejected_reason: "कारण",
      request_sent_msg: "आपका खरीद अनुरोध व्यवस्थापक को भेज दिया गया है। स्वीकृत या अस्वीकृत होने पर आपको सूचित किया जाएगा।",
      request_rejected_msg: "आपका खरीद अनुरोध व्यवस्थापक द्वारा अस्वीकार कर दिया गया था।",
      delivery_details: "वितरण विवरण"
    }
  },
  kn: {
    buyer: {
      my_orders: "ನನ್ನ ಆದೇಶಗಳು",
      track_orders: "ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳ ಖರೀದಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
      status_purchase_requested: "ಖರೀದಿ ವಿನಂತಿಸಲಾಗಿದೆ",
      status_pending_admin: "ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆ ಬಾಕಿ ಇದೆ",
      status_accepted: "ಅನುಮೋದಿಸಲಾಗಿದೆ",
      status_in_transit: "ವಿತರಣೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
      status_delivered: "ವಿತರಿಸಲಾಗಿದೆ",
      status_rejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
      order_details: "ಆದೇಶದ ವಿವರಗಳು",
      billing: "ಬಿಲ್ಲಿಂಗ್",
      timeline: "ಸ್ಥಿತಿ ಟೈಮ್‌ಲೈನ್",
      no_orders: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಆದೇಶಗಳನ್ನು ಮಾಡಿಲ್ಲ.",
      seller: "ರೈತ / ಮಾರಾಟಗಾರ",
      order_date: "ಆದೇಶದ ದಿನಾಂಕ",
      rejected_reason: "ಕಾರಣ",
      request_sent_msg: "ನಿಮ್ಮ ಖರೀದಿ ವಿನಂತಿಯನ್ನು ನಿರ್ವಾಹಕರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಅನುಮೋದಿಸಿದಾಗ ಅಥವಾ ತಿರಸ್ಕರಿಸಿದಾಗ ನಿಮಗೆ ಸೂಚಿಸಲಾಗುತ್ತದೆ.",
      request_rejected_msg: "ನಿಮ್ಮ ಖರೀದಿ ವಿನಂತಿಯನ್ನು ನಿರ್ವಾಹಕರು ತಿರಸ್ಕರಿಸಿದ್ದಾರೆ.",
      delivery_details: "ವಿತರಣಾ ವಿವರಗಳು"
    }
  },
  te: {
    buyer: {
      my_orders: "నా ఆర్డర్‌లు",
      track_orders: "మీ ఉత్పత్తి కొనుగోళ్లను ట్రాక్ చేయండి.",
      status_purchase_requested: "కొనుగోలు అభ్యర్థించబడింది",
      status_pending_admin: "అడ్మిన్ ఆమోదం పెండింగ్‌లో ఉంది",
      status_accepted: "ఆమోదించబడింది",
      status_in_transit: "డెలివరీ పురోగతిలో ఉంది",
      status_delivered: "బట్వాడా చేయబడింది",
      status_rejected: "తిరస్కరించబడింది",
      order_details: "ఆర్డర్ వివరాలు",
      billing: "బిల్లింగ్",
      timeline: "స్థితి టైమ్‌లైన్",
      no_orders: "మీరు ఇంకా ఎలాంటి ఆర్డర్‌లు చేయలేదు.",
      seller: "రైతు / విక్రేత",
      order_date: "ఆర్డర్ తేదీ",
      rejected_reason: "కారణం",
      request_sent_msg: "మీ కొనుగోలు అభ్యర్థన పరిపాలనకు పంపబడింది. ఇది ఆమోదించబడినప్పుడు లేదా తిరస్కరించబడినప్పుడు మీకు తెలియజేయబడుతుంది.",
      request_rejected_msg: "మీ కొనుగోలు అభ్యర్థన అడ్మినిస్ట్రేటర్ ద్వారా తిరస్కరించబడింది.",
      delivery_details: "డెలివరీ వివరాలు"
    }
  },
  ta: {
    buyer: {
      my_orders: "எனது ஆர்டர்கள்",
      track_orders: "உங்கள் கொள்முதல்களைக் கண்காணிக்கவும்.",
      status_purchase_requested: "கொள்முதல் கோரப்பட்டது",
      status_pending_admin: "நிர்வாகி ஒப்புதல் நிலுவையில் உள்ளது",
      status_accepted: "ஏற்றுக்கொள்ளப்பட்டது",
      status_in_transit: "விநியோகம் செயல்பாட்டில் உள்ளது",
      status_delivered: "வழங்கப்பட்டது",
      status_rejected: "நிராகரிக்கப்பட்டது",
      order_details: "ஆர்டர் விவரங்கள்",
      billing: "பில்லிங்",
      timeline: "நிலை காலவரிசை",
      no_orders: "நீங்கள் இன்னும் எந்த ஆர்டர்களும் செய்யவில்லை.",
      seller: "விவசாயி / விற்பனையாளர்",
      order_date: "ஆர்டர் தேதி",
      rejected_reason: "காரணம்",
      request_sent_msg: "உங்கள் கொள்முதல் கோரிக்கை நிர்வாகத்திற்கு அனுப்பப்பட்டுள்ளது. அது அங்கீகரிக்கப்படும்போது அல்லது நிராகரிக்கப்படும்போது உங்களுக்கு அறிவிக்கப்படும்.",
      request_rejected_msg: "உங்கள் கொள்முதல் கோரிக்கை நிர்வாகியால் நிராகரிக்கப்பட்டது.",
      delivery_details: "விநியோக விவரங்கள்"
    }
  }
};

const localesDir = path.join(__dirname, 'src/locales');

Object.keys(locales).forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!json.buyer) json.buyer = {};
    
    json.buyer = { ...json.buyer, ...locales[lang].buyer };
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log(`Updated buyer translations for ${lang}`);
  }
});
