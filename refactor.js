const fs = require('fs');

function refactor(file) {
  let content = fs.readFileSync(file, 'utf8');

  // sell/page.tsx replacements
  const replacements = [
    ['"Error: Your profile could not be loaded from the database. Please contact support or try re-registering."', 't(\'farmer.sell.profile_error\')'],
    ['"Access Denied: Buyers cannot access the Farmer dashboard."', 't(\'farmer.sell.access_denied\')'],
    ['>Sell Your Produce<', '>{t(\'farmer.sell.title\')}<'],
    ['>List your harvest on the transparent marketplace.<', '>{t(\'farmer.sell.subtitle\')}<'],
    ['>Step 1: Crop Information<', '>{t(\'farmer.sell.step1_title\')}<'],
    ['>Crop Name<', '>{t(\'farmer.sell.crop_name\')}<'],
    ['placeholder="e.g. Tomatoes"', 'placeholder={t(\'farmer.sell.crop_name_placeholder\')}'],
    ['>Category<', '>{t(\'farmer.sell.category\')}<'],
    ['>Select...<', '>{t(\'common.select\')}<'],
    ['>Vegetables<', '>{t(\'crop.categories.vegetables\')}<'],
    ['>Fruits<', '>{t(\'crop.categories.fruits\')}<'],
    ['>Cereals<', '>{t(\'crop.categories.cereals\')}<'],
    ['>Variety<', '>{t(\'farmer.sell.variety\')}<'],
    ['placeholder="e.g. Hybrid"', 'placeholder={t(\'farmer.sell.variety_placeholder\')}'],
    ['>Harvest Date<', '>{t(\'farmer.sell.harvest_date\')}<'],
    ['>Available Quantity<', '>{t(\'farmer.sell.quantity\')}<'],
    ['>Next Step<', '>{t(\'common.next_step\')}<'],
    ['>Back<', '>{t(\'common.back\')}<'],
    
    ['>Step 2: Quality Information<', '>{t(\'farmer.sell.step2_title\')}<'],
    ['>Farming Method<', '>{t(\'farmer.sell.farming_method\')}<'],
    ['>Conventional<', '>{t(\'farmer.sell.conventional\')}<'],
    ['>Organic<', '>{t(\'farmer.sell.organic\')}<'],
    ['>Description (Optional)<', '>{t(\'farmer.sell.description\')}<'],
    ['placeholder="Describe your crop\'s quality..."', 'placeholder={t(\'farmer.sell.description_placeholder\')}'],

    ['>Step 3: Pricing & Market Intelligence<', '>{t(\'farmer.sell.step3_title\')}<'],
    ['> Market Price Intelligence<', '>{t(\'farmer.sell.market_intelligence\')}<'],
    ['>Current average market price for <b>{formData.cropName || \'this crop\'}</b>.<', '>{t(\'farmer.sell.avg_price_for\')} <b>{formData.cropName || t(\'farmer.sell.this_crop\')}</b>.<'],
    ['>Lowest<', '>{t(\'farmer.sell.lowest\')}<'],
    ['>Average<', '>{t(\'farmer.sell.average\')}<'],
    ['>Highest<', '>{t(\'farmer.sell.highest\')}<'],
    ['>Your Asking Price (₹ per {formData.unit})<', '>{t(\'farmer.sell.your_asking_price\')}{formData.unit})<'],
    ['>Your asking price is above the current market average.<', '>{t(\'farmer.sell.price_above_avg\')}<'],
    ['>Your asking price is competitive.<', '>{t(\'farmer.sell.price_competitive\')}<'],

    ['>Step 4: Upload Images<', '>{t(\'farmer.sell.step4_title\')}<'],
    ['>Drag and drop images, or click to browse<', '>{t(\'farmer.sell.drag_drop\')}<'],
    ['>Required: 5 to 10 images (JPEG, PNG)<', '>{t(\'farmer.sell.images_required\')}<'],
    ['>Select Files<', '>{t(\'farmer.sell.select_files\')}<'],

    ['>Step 5: Farm Origin<', '>{t(\'farmer.sell.step5_title\')}<'],
    ['>Privacy Protected<', '>{t(\'farmer.sell.privacy_protected\')}<'],
    ['>Your private contact information and exact personal address will not be displayed publicly. Only the approximate location will be shown to buyers.<', '>{t(\'farmer.sell.privacy_desc\')}<'],
    ['>Village<', '>{t(\'farmer.sell.village\')}<'],
    ['>District<', '>{t(\'farmer.sell.district\')}<'],
    ['>State<', '>{t(\'farmer.sell.state\')}<'],

    ['>Step 6: AI Quality Analysis<', '>{t(\'farmer.sell.step6_title\')}<'],
    ['>Analyze Crop with AI<', '>{t(\'farmer.sell.analyze_crop_ai\')}<'],
    ['>Our AI will analyze the visible characteristics of your crop images to generate a quality grade, building buyer trust.<', '>{t(\'farmer.sell.analyze_desc\')}<'],
    ['>AI assessment is based only on visible characteristics and is not a certified laboratory quality test.<', '>{t(\'farmer.sell.ai_disclaimer\')}<'],
    ['>Analyzing Images...<', '>{t(\'farmer.sell.analyzing_images\')}<'],
    ['>Run AI Analysis<', '>{t(\'farmer.sell.run_ai\')}<'],
    ['> AI Visual Quality Assessment<', '>{t(\'farmer.sell.ai_assessment_title\')}<'],
    ['>Analysis complete based on visual inspection.<', '>{t(\'farmer.sell.analysis_complete\')}<'],
    ['>Grade<', '>{t(\'ai.grade\')}<'],
    ['>Quality Score<', '>{t(\'ai.quality_score\')}<'],
    ['>Freshness<', '>{t(\'ai.freshness\')}<'],
    ['>Visible Damage<', '>{t(\'ai.visible_damage\')}<'],
    ['>Disease / Pest Indicators<', '>{t(\'ai.disease_indicators\')}<'],
    ['>Color & Appearance<', '>{t(\'ai.color_appearance\')}<'],
    ['>Overall Assessment<', '>{t(\'ai.overall_assessment\')}<'],
    ['|| \'None observed\'', '|| t(\'ai.none_observed\')'],
    ['|| \'Typical for crop\'', '|| t(\'ai.typical_for_crop\')'],
    ['|| \'Quality is acceptable based on visual analysis.\'', '|| t(\'ai.quality_acceptable\')'],
    ['>Continue to Review<', '>{t(\'farmer.sell.continue_review\')}<'],

    ['>Step 7: Review Listing<', '>{t(\'farmer.sell.step7_title\')}<'],
    ['>Quantity:<', '>{t(\'farmer.sell.quantity_label\')}<'],
    ['>Asking Price:<', '>{t(\'farmer.sell.asking_price_label\')}<'],
    ['>Farming Method:<', '>{t(\'farmer.sell.farming_method_label\')}<'],
    ['>Location:<', '>{t(\'farmer.sell.location_label\')}<'],
    ['>AI Verified Grade:<', '>{t(\'farmer.sell.ai_verified_grade\')}<'],
    ['>Publishing...<', '>{t(\'farmer.sell.publishing\')}<'],
    ['>Publish Produce<', '>{t(\'farmer.sell.publish_produce\')}<'],

    ['alert("Upload at least one image first.")', 'alert(t(\'farmer.sell.alert_upload_image\'))'],
    ['alert(`AI analysis failed: ${e.message}`)', 'alert(`${t(\'farmer.sell.alert_ai_failed\')} ${e.message}`)'],
    ['alert("Please upload at least 1 image for the demo (5-10 required in prod)")', 'alert(t(\'farmer.sell.alert_demo_image\'))'],
    ['alert("Your produce listing has been submitted for platform verification.")', 'alert(t(\'farmer.sell.alert_publish_success\'))'],
    ['alert("Error: " + error.message)', 'alert(t(\'farmer.sell.alert_error\') + error.message)'],
    
    ['>Farmer Dashboard<', '>{t(\'farmer.dashboard.title\')}<'],
    ['>Manage your produce listings and orders.<', '>{t(\'farmer.dashboard.subtitle\')}<'],
    ['>Active Listings<', '>{t(\'farmer.active_listings\')}<'],
    ['>Pending Requests<', '>{t(\'farmer.pending_requests\')}<'],
    ['>Completed Orders<', '>{t(\'farmer.completed_orders\')}<'],
    ['>Earnings<', '>{t(\'farmer.earnings\')}<'],
    ['>My Listings<', '>{t(\'farmer.my_listings\')}<'],
    ['>Loading listings...<', '>{t(\'common.loading\')}<'],
    ['>No crops listed<', '>{t(\'farmer.dashboard.no_crops\')}<'],
    ['>You haven\'t listed any produce yet.<', '>{t(\'farmer.dashboard.no_crops_desc\')}<'],
    ['>List your first crop →<', '>{t(\'farmer.dashboard.list_first\')}<'],
    ['>Crop<', '>{t(\'farmer.dashboard.col_crop\')}<'],
    ['>Quantity<', '>{t(\'farmer.dashboard.col_quantity\')}<'],
    ['>Price<', '>{t(\'farmer.dashboard.col_price\')}<'],
    ['>AI Quality<', '>{t(\'farmer.dashboard.col_ai\')}<'],
    ['>Status<', '>{t(\'farmer.dashboard.col_status\')}<'],
    ['>Action<', '>{t(\'farmer.dashboard.col_action\')}<'],
    ['>Edit<', '>{t(\'common.edit\')}<']
  ];

  for (const [find, replace] of replacements) {
    // some strings might appear multiple times
    content = content.split(find).join(replace);
  }

  content = content.replace('>{item.status}<', '>{t(`status.${item.status}`)}<');
  content = content.replace('{loading ? \'Analyzing Images...\' : \'Run AI Analysis\'}', '{loading ? t(\'farmer.sell.analyzing_images\') : t(\'farmer.sell.run_ai\')}');
  content = content.replace('{loading ? \'Publishing...\' : \'Publish Produce\'}', '{loading ? t(\'farmer.sell.publishing\') : t(\'farmer.sell.publish_produce\')}');

  fs.writeFileSync(file, content);
}

refactor('src/app/farmer/sell/page.tsx');
refactor('src/app/farmer/page.tsx');
console.log('Refactored TSX files.');
