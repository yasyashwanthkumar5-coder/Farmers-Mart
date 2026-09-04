const fs = require('fs');

const path = './src/locales/en/translation.json';
const en = JSON.parse(fs.readFileSync(path, 'utf8'));

const newKeys = {
  common: {
    ...en.common,
    next_step: "Next Step",
    back: "Back",
    select: "Select...",
    edit: "Edit"
  },
  farmer: {
    ...en.farmer,
    sell: {
      profile_error: "Error: Your profile could not be loaded from the database. Please contact support or try re-registering.",
      access_denied: "Access Denied: Buyers cannot access the Farmer dashboard.",
      title: "Sell Your Produce",
      subtitle: "List your harvest on the transparent marketplace.",
      step1_title: "Step 1: Crop Information",
      crop_name: "Crop Name",
      crop_name_placeholder: "e.g. Tomatoes",
      category: "Category",
      variety: "Variety",
      variety_placeholder: "e.g. Hybrid",
      harvest_date: "Harvest Date",
      quantity: "Available Quantity",
      step2_title: "Step 2: Quality Information",
      farming_method: "Farming Method",
      conventional: "Conventional",
      organic: "Organic",
      description: "Description (Optional)",
      description_placeholder: "Describe your crop's quality...",
      step3_title: "Step 3: Pricing & Market Intelligence",
      market_intelligence: "Market Price Intelligence",
      avg_price_for: "Current average market price for",
      this_crop: "this crop",
      lowest: "Lowest",
      average: "Average",
      highest: "Highest",
      your_asking_price: "Your Asking Price (₹ per ",
      price_above_avg: "Your asking price is above the current market average.",
      price_competitive: "Your asking price is competitive.",
      step4_title: "Step 4: Upload Images",
      drag_drop: "Drag and drop images, or click to browse",
      images_required: "Required: 5 to 10 images (JPEG, PNG)",
      select_files: "Select Files",
      step5_title: "Step 5: Farm Origin",
      privacy_protected: "Privacy Protected",
      privacy_desc: "Your private contact information and exact personal address will not be displayed publicly. Only the approximate location will be shown to buyers.",
      village: "Village",
      district: "District",
      state: "State",
      step6_title: "Step 6: AI Quality Analysis",
      analyze_crop_ai: "Analyze Crop with AI",
      analyze_desc: "Our AI will analyze the visible characteristics of your crop images to generate a quality grade, building buyer trust.",
      ai_disclaimer: "AI assessment is based only on visible characteristics and is not a certified laboratory quality test.",
      analyzing_images: "Analyzing Images...",
      run_ai: "Run AI Analysis",
      ai_assessment_title: "AI Visual Quality Assessment",
      analysis_complete: "Analysis complete based on visual inspection.",
      continue_review: "Continue to Review",
      step7_title: "Step 7: Review Listing",
      quantity_label: "Quantity:",
      asking_price_label: "Asking Price:",
      farming_method_label: "Farming Method:",
      location_label: "Location:",
      ai_verified_grade: "AI Verified Grade:",
      publishing: "Publishing...",
      publish_produce: "Publish Produce",
      alert_upload_image: "Upload at least one image first.",
      alert_ai_failed: "AI analysis failed:",
      alert_demo_image: "Please upload at least 1 image for the demo (5-10 required in prod)",
      alert_publish_success: "Your produce listing has been submitted for platform verification.",
      alert_error: "Error: "
    },
    dashboard: {
      title: "Farmer Dashboard",
      subtitle: "Manage your produce listings and orders.",
      no_crops: "No crops listed",
      no_crops_desc: "You haven't listed any produce yet.",
      list_first: "List your first crop →",
      col_crop: "Crop",
      col_quantity: "Quantity",
      col_price: "Price",
      col_ai: "AI Quality",
      col_status: "Status",
      col_action: "Action"
    }
  },
  ai: {
    title: "Agri Assistant",
    placeholder: "Ask something...",
    listening: "Listening...",
    grade: "Grade",
    quality_score: "Quality Score",
    freshness: "Freshness",
    visible_damage: "Visible Damage",
    disease_indicators: "Disease / Pest Indicators",
    color_appearance: "Color & Appearance",
    overall_assessment: "Overall Assessment",
    none_observed: "None observed",
    typical_for_crop: "Typical for crop",
    quality_acceptable: "Quality is acceptable based on visual analysis.",
    welcome: "Hello! I'm your Agriculture Assistant. Ask me about crops, prices, orders, storage or how to use the platform.",
    error: "Sorry, I encountered an error.",
    browser_unsupported: "Your browser does not support speech recognition."
  },
  crop: {
    categories: {
      vegetables: "Vegetables",
      fruits: "Fruits",
      cereals: "Cereals"
    }
  },
  status: {
    active: "Active",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    shipped: "Shipped",
    delivered: "Delivered",
    completed: "Completed",
    cancelled: "Cancelled"
  }
};

const finalEn = { ...en, ...newKeys };

fs.writeFileSync(path, JSON.stringify(finalEn, null, 2));
console.log('Updated translation.json');
