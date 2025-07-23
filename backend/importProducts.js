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
  // Improved parsing for robust product import from OCR JSON
  const products = [];
  for (const page of json.page_data) {
    const raw = page.raw_text || '';
    // Extract product name (first line or bold text)
    const nameMatch = raw.match(/^(MILITARY|SAFETY|OFFICIAL)[^\n]*/i);
    const name = nameMatch ? nameMatch[0].trim() : raw.split('\n')[0].trim() || 'Unknown Product';
    // Extract prices
    const wholesaleMatch = raw.match(/Wholesale[^\d]*(\d+)/i);
    const retailMatch = raw.match(/Retail[^\d]*(\d+)/i);
    const wholesalePrice = wholesaleMatch ? parseInt(wholesaleMatch[1], 10) : 0;
    const retailPrice = retailMatch ? parseInt(retailMatch[1], 10) : 0;
    // Description: lines after name, before cost breakdown
    const descLines = raw.split('\n').slice(1, 4).filter(l => l && !l.match(/(Wholesale|Retail|Cost|Total|Ksh|\d+)/i));
    const description = descLines.join(' ').trim() || name;
    // Features: look for bullet points or lines with '-' or '•'
    const features = raw.split('\n').filter(l => l.match(/[-•]/) && l.length < 80).map(l => l.replace(/[-•]/, '').trim());
    // Images
    const images = page.image_url ? [page.image_url] : [];
    // Cost breakdown: lines with 'item cost' or 'Ksh'
    const costBreakdown = {};
    const costLines = raw.split(/\n|\r/).filter(l => l.match(/\d/) && (l.match(/Ksh|Total|Leather|Sole|Labour|Thread|Glue|Eyelets|Laces|Texon|Stiffner|Shank|Jeans|Lining|Box|Collection|Dull|Stitch|Insole|Outsole|Padding|Foam|PU|PVC|Rubber|Unit/i)));
    for (const line of costLines) {
      // e.g. 'Leather Ksh 380' or 'Sole 170'
      const match = line.match(/([A-Za-z\s]+)[^\d]*(\d+)/);
      if (match) {
        const key = match[1].replace(/Ksh|:|\.|\s+$/g, '').trim();
        const value = parseInt(match[2], 10);
        if (key && !isNaN(value)) costBreakdown[key] = value;
      }
    }
    // Tags
    const tags = [];
    if (/new/i.test(raw)) tags.push('New');
    if (/best\s?seller/i.test(raw)) tags.push('Best Seller');
    // Type/category
    let type = 'Shoes';
    if (/boot|military/i.test(name)) type = 'Boots';
    else if (/safety/i.test(name)) type = 'Safety';
    else if (/official/i.test(name)) type = 'Official';
    // SKU
    const sku = name.replace(/\s+/g, '_').toUpperCase();
    products.push({
      name,
      type,
      sku,
      wholesalePrice,
      retailPrice,
      stockQuantity: 100,
      description,
      features,
      costBreakdown,
      images,
      category: type,
      tags,
    });
  }
  return products;
}
// main logic
async function main() {
  await mongoose.connect(MONGO_URI);
  const supplier = await ensureDefaultSupplier();
  const json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  const products = parseProductsFromJson(json);
  for (const prod of products) {
    await Product.findOneAndUpdate(
      { sku: prod.sku },
      { ...prod, supplier: supplier._id },
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