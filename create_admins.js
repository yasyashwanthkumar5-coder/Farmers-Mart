require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const admins = [
  { email: 'admin1@agrimart.com', password: 'AdminSecurePass!1', phone: '9000000001' },
  { email: 'admin2@agrimart.com', password: 'AdminSecurePass!2', phone: '9000000002' },
  { email: 'admin3@agrimart.com', password: 'AdminSecurePass!3', phone: '9000000003' },
  { email: 'admin4@agrimart.com', password: 'AdminSecurePass!4', phone: '9000000004' },
  { email: 'admin5@agrimart.com', password: 'AdminSecurePass!5', phone: '9000000005' },
];

async function createAccounts() {
  console.log('Creating admin accounts...');
  
  for (let i = 0; i < admins.length; i++) {
    const admin = admins[i];
    const { data, error } = await supabase.auth.signUp({
      email: admin.email,
      password: admin.password,
      options: {
        data: {
          role: 'buyer', // Trigger overrides to buyer anyway
          full_name: `Administrator ${i+1}`,
          mobile_number: admin.phone
        }
      }
    });

    if (error) {
      console.error(`Failed to create ${admin.email}:`, error.message);
    } else {
      console.log(`Created ${admin.email} (ID: ${data.user.id})`);
    }
  }
}

createAccounts();
