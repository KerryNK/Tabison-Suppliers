import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Product from './models/Product.js';
import Supplier from './models/Supplier.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tabison';
const JSON_PATH = path.join(process.cwd(), '../TABISON SUPPLIERS.json');
const DEFAULT_SUPPLIER = {
  name: 'Tabison Default Supplier',
  email: 'default@tabison.com',
  phone: '0000000000',
  address: 'Nairobi, Kenya',
};

async function ensureDefaultSupplier() {
  let supplier = await Supplier.findOne({ email: DEFAULT_SUPPLIER.email });
  if (!supplier) {
    supplier = await Supplier.create(DEFAULT_SUPPLIER);
  }
  return supplier;
}

function parseProductsFromJson(json) {
  // This function should be improved for more robust parsing as needed
  const products = [];
  for (const page of json.page_data) {
    const raw = page.raw_text;
    if (!raw) continue;
    // Try to extract product name and prices heuristically
    const nameMatch = raw.match(/^(MILITARY|SAFETY|OFFICIAL)[^\n]*/i);
    const name = nameMatch ? nameMatch[0].trim() : 'Unknown Product';
    const wholesaleMatch = raw.match(/Wholesale[^\d]*(\d+)/i);
    const retailMatch = raw.match(/Retail[^\d]*(\d+)/i);
    const wholesalePrice = wholesaleMatch ? parseInt(wholesaleMatch[1], 10) : 0;
    const retailPrice = retailMatch ? parseInt(retailMatch[1], 10) : 0;
    const description = raw.split('\n')[0];
    const images = page.image_url ? [page.image_url] : [];
    // Cost breakdown: look for lines with pattern 'item cost' (very basic)
    const costBreakdown = [];
    const costLines = raw.split(/\n|\r/).filter(l => l.match(/\d/));
    for (const line of costLines) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const cost = parseInt(parts[parts.length - 1].replace(/[^\d]/g, ''), 10);
        if (!isNaN(cost)) {
          costBreakdown.push({ item: parts.slice(0, -1).join(' '), cost });
        }
      }
    }
    products.push({
      name,
      type: 'Shoes', // Default, can be improved
      sku: name.replace(/\s+/g, '_').toUpperCase(),
      wholesalePrice,
      retailPrice,
      stockQuantity: 100, // Default
      description,
      costBreakdown,
      images,
    });
  }
  return products;
}

async function main() {
  await mongoose.connect(MONGO_URI);
  const supplier = await ensureDefaultSupplier();
  const json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  const products = parseProductsFromJson(json);
  for (const prod of products) {
    prod.supplier = supplier._id;
    // Upsert by SKU
    await Product.findOneAndUpdate(
      { sku: prod.sku },
      prod,
      { upsert: true, new: true }
    );
  }
  console.log(`Imported ${products.length} products.`);
  await mongoose.disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 