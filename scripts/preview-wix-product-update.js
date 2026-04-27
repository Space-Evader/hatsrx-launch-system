#!/usr/bin/env node

/**
 * HatsRx Wix Product Update Preview (Dry Run)
 *
 * Purpose:
 * - Read a single product update JSON file
 * - Print a human-readable preview of Wix fields that would be updated
 *
 * Safety:
 * - Does NOT call Wix APIs
 * - Does NOT modify any files
 * - Does NOT update Wix
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_INPUT_PATH = 'data/products/astronaut-lounger.json';
const DESCRIPTION_PREVIEW_MAX_LENGTH = 280;

function hasNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toDisplayValue(value) {
  return hasNonEmptyString(value) ? value : '(missing)';
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.filter((tag) => typeof tag === 'string' && tag.trim().length > 0);
}

function createDescriptionPreview(descriptionHtml) {
  if (!hasNonEmptyString(descriptionHtml)) {
    return '(missing)';
  }

  const oneLine = descriptionHtml.replace(/\s+/g, ' ').trim();
  if (oneLine.length <= DESCRIPTION_PREVIEW_MAX_LENGTH) {
    return oneLine;
  }

  return `${oneLine.slice(0, DESCRIPTION_PREVIEW_MAX_LENGTH)}...`;
}

function printUsage() {
  console.log('Usage: node scripts/preview-wix-product-update.js [json-file]');
  console.log('Default file: data/products/astronaut-lounger.json');
}

function main() {
  const arg = process.argv[2];

  if (arg === '--help' || arg === '-h') {
    printUsage();
    process.exit(0);
  }

  const inputPath = arg || DEFAULT_INPUT_PATH;
  const resolvedPath = path.resolve(process.cwd(), inputPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  let payload;

  try {
    const raw = fs.readFileSync(resolvedPath, 'utf8');
    payload = JSON.parse(raw);
  } catch (error) {
    console.error(`Error: Unable to read/parse JSON from ${inputPath}`);
    console.error(`Details: ${error.message}`);
    process.exit(1);
  }

  const productId = payload?.match?.productId;
  const productSlug = payload?.match?.productSlug;
  const finalName = payload?.updates?.finalName;
  const collection = payload?.updates?.collection;
  const tags = normalizeTags(payload?.updates?.tags);
  const descriptionPreview = createDescriptionPreview(payload?.updates?.descriptionHtml);

  console.log('HatsRx Wix Product Update Preview (Dry Run)');
  console.log('============================================');
  console.log(`Source file: ${path.relative(process.cwd(), resolvedPath)}`);
  console.log('');
  console.log('Wix fields to update:');
  console.log(`- productId: ${toDisplayValue(productId)}`);
  console.log(`- productSlug: ${toDisplayValue(productSlug)}`);
  console.log(`- finalName: ${toDisplayValue(finalName)}`);
  console.log(`- collection: ${toDisplayValue(collection)}`);
  console.log(`- tags (${tags.length}): ${tags.length > 0 ? tags.join(', ') : '(missing)'}`);
  console.log(`- descriptionHtml preview: ${descriptionPreview}`);
  console.log('');
  console.log('Safety check: No Wix API calls were made. No files were modified.');
}

main();
