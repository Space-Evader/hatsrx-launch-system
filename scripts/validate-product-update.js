#!/usr/bin/env node

/**
 * HatsRx Product Update Validator (Dry Run)
 *
 * Purpose:
 * - Read one or more JSON files from disk
 * - Validate required structure/content for Wix product update payloads
 * - Print a human-readable validation report
 *
 * Safety:
 * - Does NOT call Wix APIs
 * - Does NOT modify Wix or local JSON files
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_TOP_LEVEL_KEYS = ['match', 'updates', 'taxonomy', 'quizMapping', 'review'];
const REQUIRED_TAXONOMY_FIELDS = [
  'mood',
  'vibe',
  'fit',
  'colorEnergy',
  'occasion',
  'rxCollection',
  'subscriptionEligible',
  'bestsellerCandidate',
];

// Forbidden in update payloads per workflow/template safety rules.
const PROHIBITED_EXACT_KEYS = new Set([
  'price',
  'prices',
  'payment',
  'payments',
  'shipping',
  'fulfillment',
  'subscription',
  'subscriptions',
  'publishing',
  'published',
  'publishstatus',
]);

const ALLOWED_EXCEPTION_KEYS = new Set(['subscriptioneligible']);

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function listJsonFilesFromArg(inputPath) {
  const resolved = path.resolve(process.cwd(), inputPath);

  if (!fs.existsSync(resolved)) {
    return { files: [], errors: [`Path not found: ${inputPath}`] };
  }

  const stats = fs.statSync(resolved);
  if (stats.isFile()) {
    return resolved.endsWith('.json')
      ? { files: [resolved], errors: [] }
      : { files: [], errors: [`Not a JSON file: ${inputPath}`] };
  }

  if (!stats.isDirectory()) {
    return { files: [], errors: [`Unsupported path type: ${inputPath}`] };
  }

  const files = fs
    .readdirSync(resolved)
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.join(resolved, name));

  if (files.length === 0) {
    return { files: [], errors: [`No JSON files found in directory: ${inputPath}`] };
  }

  return { files, errors: [] };
}

function findProhibitedKeys(value, currentPath = '$', hits = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findProhibitedKeys(item, `${currentPath}[${index}]`, hits));
    return hits;
  }

  if (!isPlainObject(value)) {
    return hits;
  }

  for (const key of Object.keys(value)) {
    const lowerKey = key.toLowerCase();
    const isProhibited =
      PROHIBITED_EXACT_KEYS.has(lowerKey) ||
      (lowerKey.startsWith('publish') && !ALLOWED_EXCEPTION_KEYS.has(lowerKey));

    if (isProhibited && !ALLOWED_EXCEPTION_KEYS.has(lowerKey)) {
      hits.push(`${currentPath}.${key}`);
    }

    findProhibitedKeys(value[key], `${currentPath}.${key}`, hits);
  }

  return hits;
}

function validateProductUpdatePayload(payload) {
  const errors = [];

  if (!isPlainObject(payload)) {
    return { errors: ['Root payload must be a JSON object.'] };
  }

  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (!(key in payload)) {
      errors.push(`Missing required top-level key: ${key}`);
    }
  }

  if (isPlainObject(payload.match)) {
    const hasProductId = hasNonEmptyString(payload.match.productId);
    const hasProductSlug = hasNonEmptyString(payload.match.productSlug);
    if (!hasProductId && !hasProductSlug) {
      errors.push('match.productId or match.productSlug must exist and be non-empty.');
    }
  } else {
    errors.push('match must be an object.');
  }

  if (isPlainObject(payload.updates)) {
    if (!hasNonEmptyString(payload.updates.finalName)) {
      errors.push('updates.finalName is required and must be non-empty.');
    }

    if (!hasNonEmptyString(payload.updates.descriptionHtml)) {
      errors.push('updates.descriptionHtml is required and must be non-empty.');
    }
  } else {
    errors.push('updates must be an object.');
  }

  if (isPlainObject(payload.taxonomy)) {
    for (const field of REQUIRED_TAXONOMY_FIELDS) {
      if (!(field in payload.taxonomy)) {
        errors.push(`taxonomy.${field} is required.`);
      }
    }
  } else {
    errors.push('taxonomy must be an object.');
  }

  if (isPlainObject(payload.review)) {
    const status = payload.review.status;
    if (!(status === 'draft' || status === 'approved')) {
      errors.push('review.status must be either "draft" or "approved".');
    }
  } else {
    errors.push('review must be an object.');
  }

  const prohibitedHits = findProhibitedKeys(payload);
  if (prohibitedHits.length > 0) {
    errors.push(`Prohibited fields detected: ${prohibitedHits.join(', ')}`);
  }

  return { errors };
}

function validateFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const payload = JSON.parse(raw);
    const { errors } = validateProductUpdatePayload(payload);
    return { filePath, valid: errors.length === 0, errors };
  } catch (error) {
    return {
      filePath,
      valid: false,
      errors: [`Unable to read/parse JSON: ${error.message}`],
    };
  }
}

function printUsage() {
  console.log('Usage: node scripts/validate-product-update.js <json-file-or-directory> [more paths...]');
  console.log('Example: node scripts/validate-product-update.js data/products/astronaut-lounger.json');
  console.log('Example: node scripts/validate-product-update.js data/products');
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const allFiles = [];
  const argErrors = [];

  for (const arg of args) {
    const { files, errors } = listJsonFilesFromArg(arg);
    allFiles.push(...files);
    argErrors.push(...errors);
  }

  if (argErrors.length > 0) {
    console.log('Input errors:');
    argErrors.forEach((error) => console.log(`  - ${error}`));
  }

  const uniqueFiles = [...new Set(allFiles)];
  if (uniqueFiles.length === 0) {
    process.exit(1);
  }

  console.log('HatsRx Product Update Validator (Dry Run)');
  console.log('-----------------------------------------');

  const results = uniqueFiles.map(validateFile);

  for (const result of results) {
    const relative = path.relative(process.cwd(), result.filePath) || result.filePath;
    if (result.valid) {
      console.log(`PASS: ${relative}`);
    } else {
      console.log(`FAIL: ${relative}`);
      result.errors.forEach((error) => console.log(`  - ${error}`));
    }
  }

  const passed = results.filter((r) => r.valid).length;
  const failed = results.length - passed;

  console.log('-----------------------------------------');
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
