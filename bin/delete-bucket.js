#!/usr/bin/env node

const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config(); // Load from .env in the user's project

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const buckets = process.argv.slice(2);

if (buckets.length === 0) {
  console.error("❌ Please specify one or more bucket names to delete.");
  process.exit(1);
}

// Recursively collect all file paths in the bucket
async function listAllFiles(bucket, prefix = '') {
  let allFiles = [];

  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 1000,
  });

  if (error) {
    console.error(`❌ Error listing "${prefix}" in "${bucket}":`, error.message);
    return [];
  }

  for (const item of data) {
    const fullPath = path.posix.join(prefix, item.name);
    if (item.name.endsWith('/')) continue;

    if (!item.metadata && !item.name.includes('.')) {
      const nested = await listAllFiles(bucket, fullPath);
      allFiles = allFiles.concat(nested);
    } else {
      allFiles.push(fullPath);
    }
  }

  return allFiles;
}

async function deleteBucket(bucket) {
  console.log(`🔍 Deleting contents of bucket: "${bucket}"`);

  const files = await listAllFiles(bucket);

  if (files.length > 0) {
    const { error: deleteError } = await supabase.storage.from(bucket).remove(files);
    if (deleteError) {
      console.error(`❌ Failed to delete files in "${bucket}":`, deleteError.message);
      return;
    }
    console.log(`🗑️ Deleted ${files.length} file(s) from "${bucket}"`);
  }

  const { error: bucketError } = await supabase.storage.deleteBucket(bucket);
  if (bucketError) {
    console.error(`❌ Failed to delete bucket "${bucket}":`, bucketError.message);
  } else {
    console.log(`✅ Bucket "${bucket}" deleted.`);
  }
}

(async () => {
  for (const bucket of buckets) {
    await deleteBucket(bucket);
  }
})();
