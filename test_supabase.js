require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  // Get the most recent listing
  const { data: listings, error: err1 } = await supabase
    .from('crop_listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (err1) {
    console.error('Error fetching listings:', err1);
    return;
  }
  
  if (!listings || listings.length === 0) {
    console.log('No listings found in the database at all.');
    return;
  }
  
  const id = listings[0].id;
  console.log('Found listing with ID:', id);
  
  // Try to fetch it using the exact query from the page
  const { data, error } = await supabase
    .from('crop_listings')
    .select(`
      *,
      crops ( name, variety ),
      profiles ( district, state )
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching specific listing:', error);
  } else {
    console.log('Successfully fetched listing details:', data);
  }
}

test();
