const fs = require('fs');
const path = require('path');

const locales = {
  en: {
    admin: {
      requests: "Purchase Requests Mediation",
      requests_desc: "Review buyer requests, check farmer availability, and mediate the connection. Upon approval, an Order ID will be generated.",
      tab_pending: "Pending",
      tab_in_process: "Accepted / In Process",
      tab_delivered: "Delivered",
      tab_rejected: "Rejected",
      crop_details: "Crop Details",
      buyer_info: "Buyer Information",
      farmer_info: "Farmer Contact",
      billing_summary: "Billing Summary",
      produce_subtotal: "Produce Subtotal",
      logistics_cost: "Logistics Cost",
      total_amount: "Total Amount",
      approve: "Approve Request",
      reject: "Reject Request",
      mark_delivered: "Mark as Delivered",
      delivery_in_process: "Delivery in Process",
      accepted: "Accepted",
      delivered: "Delivered",
      rejected: "Rejected",
      order_id: "Order ID",
      qty: "Quantity",
      price: "Price",
      no_requests: "No requests found for this status.",
      all_caught_up: "All caught up!"
    }
  },
  hi: {
    admin: {
      requests: "खरीद अनुरोध मध्यस्थता",
      requests_desc: "खरीदार अनुरोधों की समीक्षा करें, किसान की उपलब्धता की जांच करें और मध्यस्थता करें। स्वीकृति पर एक ऑर्डर आईडी जेनरेट की जाएगी।",
      tab_pending: "लंबित",
      tab_in_process: "स्वीकृत / प्रक्रिया में",
      tab_delivered: "वितरित",
      tab_rejected: "अस्वीकृत",
      crop_details: "फसल विवरण",
      buyer_info: "क्रेता जानकारी",
      farmer_info: "किसान संपर्क",
      billing_summary: "बिलिंग सारांश",
      produce_subtotal: "उपज उप-योग",
      logistics_cost: "लॉजिस्टिक्स लागत",
      total_amount: "कुल राशि",
      approve: "अनुरोध स्वीकृत करें",
      reject: "अनुरोध अस्वीकार करें",
      mark_delivered: "वितरित के रूप में चिह्नित करें",
      delivery_in_process: "वितरण प्रक्रिया में",
      accepted: "स्वीकृत",
      delivered: "वितरित",
      rejected: "अस्वीकृत",
      order_id: "ऑर्डर आईडी",
      qty: "मात्रा",
      price: "कीमत",
      no_requests: "इस स्थिति के लिए कोई अनुरोध नहीं मिला।",
      all_caught_up: "सभी काम पूरे हो गए!"
    }
  },
  kn: {
    admin: {
      requests: "ಖರೀದಿ ವಿನಂತಿಗಳ ಮಧ್ಯಸ್ಥಿಕೆ",
      requests_desc: "ಖರೀದಿದಾರರ ವಿನಂತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ರೈತರ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ. ಅನುಮೋದನೆಯ ನಂತರ, ಆರ್ಡರ್ ಐಡಿ ರಚಿಸಲಾಗುತ್ತದೆ.",
      tab_pending: "ಬಾಕಿ ಉಳಿದಿದೆ",
      tab_in_process: "ಅನುಮೋದಿಸಲಾಗಿದೆ / ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
      tab_delivered: "ವಿತರಿಸಲಾಗಿದೆ",
      tab_rejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
      crop_details: "ಬೆಳೆ ವಿವರಗಳು",
      buyer_info: "ಖರೀದಿದಾರರ ಮಾಹಿತಿ",
      farmer_info: "ರೈತ ಸಂಪರ್ಕ",
      billing_summary: "ಬಿಲ್ಲಿಂಗ್ ಸಾರಾಂಶ",
      produce_subtotal: "ಉತ್ಪನ್ನಗಳ ಉಪಮೊತ್ತ",
      logistics_cost: "ಸಾಗಾಟ ವೆಚ್ಚ",
      total_amount: "ಒಟ್ಟು ಮೊತ್ತ",
      approve: "ವಿನಂತಿಯನ್ನು ಅನುಮೋದಿಸಿ",
      reject: "ವಿನಂತಿಯನ್ನು ತಿರಸ್ಕರಿಸಿ",
      mark_delivered: "ವಿತರಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
      delivery_in_process: "ವಿತರಣೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
      accepted: "ಅನುಮೋದಿಸಲಾಗಿದೆ",
      delivered: "ವಿತರಿಸಲಾಗಿದೆ",
      rejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
      order_id: "ಆರ್ಡರ್ ಐಡಿ",
      qty: "ಪ್ರಮಾಣ",
      price: "ಬೆಲೆ",
      no_requests: "ಈ ಸ್ಥಿತಿಗೆ ಯಾವುದೇ ವಿನಂತಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
      all_caught_up: "ಎಲ್ಲಾ ಪೂರ್ಣಗೊಂಡಿದೆ!"
    }
  },
  te: {
    admin: {
      requests: "కొనుగోలు అభ్యర్థనల మధ్యవర్తిత్వం",
      requests_desc: "కొనుగోలుదారుల అభ్యర్థనలను సమీక్షించండి, రైతుల లభ్యతను తనిఖీ చేయండి. ఆమోదం పొందిన తర్వాత, ఆర్డర్ ఐడి సృష్టించబడుతుంది.",
      tab_pending: "పెండింగ్‌లో ఉంది",
      tab_in_process: "ఆమోదించబడింది / పురోగతిలో ఉంది",
      tab_delivered: "బట్వాడా చేయబడింది",
      tab_rejected: "తిరస్కరించబడింది",
      crop_details: "పంట వివరాలు",
      buyer_info: "కొనుగోలుదారు సమాచారం",
      farmer_info: "రైతు సంప్రదింపు",
      billing_summary: "బిల్లింగ్ సారాంశం",
      produce_subtotal: "ఉత్పత్తి ఉపమొత్తం",
      logistics_cost: "లాజిస్టిక్స్ ఖర్చు",
      total_amount: "మొత్తం",
      approve: "అభ్యర్థనను ఆమోదించండి",
      reject: "అభ్యర్థనను తిరస్కరించండి",
      mark_delivered: "బట్వాడా చేయబడినట్లు గుర్తించండి",
      delivery_in_process: "బట్వాడా పురోగతిలో ఉంది",
      accepted: "ఆమోదించబడింది",
      delivered: "బట్వాడా చేయబడింది",
      rejected: "తిరస్కరించబడింది",
      order_id: "ఆర్డర్ ఐడి",
      qty: "పరిమాణం",
      price: "ధర",
      no_requests: "ఈ స్థితికి సంబంధించి ఎలాంటి అభ్యర్థనలు కనుగొనబడలేదు.",
      all_caught_up: "అన్నీ పూర్తయ్యాయి!"
    }
  },
  ta: {
    admin: {
      requests: "கொள்முதல் கோரிக்கைகள் மத்தியஸ்தம்",
      requests_desc: "வாங்குபவர் கோரிக்கைகளை மதிப்பாய்வு செய்யவும், விவசாயிகளின் இருப்பை சரிபார்க்கவும். ஒப்புதலுக்குப் பிறகு, ஆர்டர் ஐடி உருவாக்கப்படும்.",
      tab_pending: "நிலுவையில் உள்ளது",
      tab_in_process: "ஏற்றுக்கொள்ளப்பட்டது / செயல்பாட்டில் உள்ளது",
      tab_delivered: "வழங்கப்பட்டது",
      tab_rejected: "நிராகரிக்கப்பட்டது",
      crop_details: "பயிர் விவரங்கள்",
      buyer_info: "வாங்குபவர் தகவல்",
      farmer_info: "விவசாயி தொடர்பு",
      billing_summary: "பில்லிங் சுருக்கம்",
      produce_subtotal: "உற்பத்தி துணை மொத்தம்",
      logistics_cost: "தளவாட செலவு",
      total_amount: "மொத்த தொகை",
      approve: "கோரிக்கையை அங்கீகரி",
      reject: "கோரிக்கையை நிராகரி",
      mark_delivered: "வழங்கப்பட்டதாக குறிக்கவும்",
      delivery_in_process: "விநியோகம் செயல்பாட்டில் உள்ளது",
      accepted: "ஏற்றுக்கொள்ளப்பட்டது",
      delivered: "வழங்கப்பட்டது",
      rejected: "நிராகரிக்கப்பட்டது",
      order_id: "ஆர்டர் ஐடி",
      qty: "அளவு",
      price: "விலை",
      no_requests: "இந்த நிலைக்கு கோரிக்கைகள் எதுவும் கிடைக்கவில்லை.",
      all_caught_up: "எல்லாம் முடிந்தது!"
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
    console.log(`Updated admin translations for ${lang}`);
  }
});
