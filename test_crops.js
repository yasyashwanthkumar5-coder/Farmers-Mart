require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data: catData, error: catErr } = await supabase.from('crop_categories').insert({ name: 'TestCat' + Date.now() }).select().single();
  console.log('Cat Insert:', catData, catErr);

  if (catData) {
    const { data: cropData, error: cropErr } = await supabase.from('crops').insert({ category_id: catData.id, name: 'TestCrop' + Date.now(), variety: 'TestVar' }).select().single();
    console.log('Crop Insert:', cropData, cropErr);
  }
}

test();
