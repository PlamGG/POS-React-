import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the root of POS-React
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding modifiers...");
  
  // 1. Insert Sweetness Level (Single choice, Required)
  const { data: group1, error: err1 } = await supabase.from('modifier_groups').insert({
    category: 'Drinks',
    name: 'ระดับความหวาน (Sweetness)',
    type: 'single',
    is_required: true
  }).select().single();

  if (err1) { console.error(err1); return; }

  const options1 = [
    { group_id: group1.id, name: '0% (ไม่หวานเลย)', price: 0 },
    { group_id: group1.id, name: '25% (หวานน้อยมาก)', price: 0 },
    { group_id: group1.id, name: '50% (หวานน้อย)', price: 0 },
    { group_id: group1.id, name: '100% (ปกติ)', price: 0 },
    { group_id: group1.id, name: '125% (หวานมาก)', price: 0 }
  ];

  await supabase.from('modifier_options').insert(options1);
  console.log("Inserted Sweetness options.");

  // 2. Insert Toppings (Multiple choice, Optional)
  const { data: group2, error: err2 } = await supabase.from('modifier_groups').insert({
    category: 'Drinks',
    name: 'เพิ่มท็อปปิ้ง (Toppings)',
    type: 'multiple',
    is_required: false
  }).select().single();

  if (err2) { console.error(err2); return; }

  const options2 = [
    { group_id: group2.id, name: 'ไข่มุก (Boba)', price: 10 },
    { group_id: group2.id, name: 'บุกเพชร (Crystal Boba)', price: 15 },
    { group_id: group2.id, name: 'วิปครีม (Whip Cream)', price: 20 },
    { group_id: group2.id, name: 'พุดดิ้ง (Pudding)', price: 15 }
  ];

  await supabase.from('modifier_options').insert(options2);
  console.log("Inserted Toppings options.");

  console.log("Seed completed successfully!");
}

seed();
