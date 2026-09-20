import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
global.WebSocket = WebSocket;

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    env[key.trim()] = value.join('=').trim();
  }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET_NAME = 'product_images';

async function main() {
  console.log('Starting image migration to Supabase Storage...');
  
  const imagesDir = path.resolve(process.cwd(), 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    console.error(`Images directory not found at ${imagesDir}`);
    return;
  }

  const files = fs.readdirSync(imagesDir);
  
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    if (!fs.lstatSync(filePath).isFile()) continue;

    console.log(`\nUploading ${file}...`);
    const fileBuffer = fs.readFileSync(filePath);
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(file, fileBuffer, {
        upsert: true,
        contentType: 'image/jpeg' // assuming mostly jpgs based on previous logs
      });

    if (uploadError) {
      console.error(`Failed to upload ${file}:`, uploadError.message);
      continue;
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(file);
    
    const publicUrl = publicUrlData.publicUrl;
    console.log(`Uploaded! URL: ${publicUrl}`);

    // Update database
    const oldImagePath = `/images/${file}`;
    const { data: updateData, error: updateError } = await supabase
      .from('products')
      .update({ image: publicUrl })
      .eq('image', oldImagePath);

    if (updateError) {
      console.error(`Failed to update DB for ${file}:`, updateError.message);
    } else {
      console.log(`Successfully linked ${file} to products table.`);
    }
  }

  console.log('\nMigration complete!');
}

main().catch(console.error);
