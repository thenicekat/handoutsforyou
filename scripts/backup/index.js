// Import necessary modules
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Read environment variables
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Tables to back up
const tablesToBackup = [
  "ps1_responses",
  "ps1_reviews",
  "ps2_responses",
  "ps2_reviews",
  "course_reviews",
  "course_resources",
  "course_grading",
  "si_chronicles",
  "si_companies",
  "placement_ctcs",
  "higherstudies_resources",
];

async function backupDatabase() {
  try {
    console.log('Starting database backup...');

    const backupPromises = tablesToBackup.map(async (tableName) => {
      console.log(`Fetching data for table: ${tableName}`);

      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.error(`Error fetching data for table ${tableName}:`, error);
        return '';
      }

      const rows = data.map((row) => {
        const values = Object.values(row)
          .map((value) => (value === null ? 'NULL' : `'${value.toString().replace(/'/g, "''")}'`))
          .join(', ');
        return `INSERT INTO ${tableName} VALUES (${values});`;
      });

      return `-- Data for table ${tableName}\n${rows.join('\n')}`;
    });

    const backupContents = await Promise.all(backupPromises);

    const sqlFileContents = `-- Backup created at ${new Date().toISOString()}\n\n${backupContents.join('\n\n')}`;

    const backupFileName = `backup_${Date.now()}.sql`;
    fs.writeFileSync(backupFileName, sqlFileContents);

    console.log(`Backup completed successfully. File saved as ${backupFileName}`);
  } catch (err) {
    console.error('Error creating backup:', err);
  }
}

backupDatabase();
