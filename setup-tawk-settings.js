// Script to manually insert Tawk.to settings into the database
const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://dfmbicodohmkyasuofov.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbWJpY29kb2hta3lhc3VvZm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NzQwMDAsImV4cCI6MjA1MTM1MDAwfQ.example';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTawkSettings() {
  console.log('Setting up Tawk.to settings...');
  
  const settings = [
    { key: 'tawk_enabled', value: true, description: 'Enable Tawk.to live chat widget' },
    { key: 'tawk_property_id', value: '68d3e2e9a5528e1923b79293', description: 'Tawk.to Property ID' },
    { key: 'tawk_widget_id', value: '1j5tqsot9', description: 'Tawk.to Widget ID' },
    { key: 'tawk_3d_enabled', value: false, description: 'Enable 3D Tawk.to widget' },
    { key: 'tawk_avatar_url', value: '', description: 'Custom avatar URL for Tawk.to' },
    { key: 'tawk_use_default_launcher', value: true, description: 'Use default Tawk.to launcher' }
  ];
  
  for (const setting of settings) {
    try {
      const { error } = await supabase
        .from('website_settings')
        .upsert({
          key: setting.key,
          value: setting.value,
          description: setting.description
        }, {
          onConflict: 'key'
        });
      
      if (error) {
        console.error(`Error inserting ${setting.key}:`, error);
      } else {
        console.log(`✅ ${setting.key} set successfully`);
      }
    } catch (err) {
      console.error(`Error with ${setting.key}:`, err);
    }
  }
  
  console.log('Tawk.to settings setup complete!');
}

setupTawkSettings().catch(console.error);


