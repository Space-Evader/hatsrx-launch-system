#!/usr/bin/env node

/**
 * HatsRx Wix Product Fetcher (Read-Only)
 *
 * Purpose:
 * - Connect to Wix API with placeholder authentication
 * - Fetch current product data for a productId
 * - Print key product fields for safe review
 *
 * Safety:
 * - READ ONLY
 * - Does NOT update Wix
 * - Does NOT modify local files
 */

const DEFAULT_WIX_API_BASE_URL = 'https://www.wixapis.com/stores/v1/products';

function printUsage() {
  console.log('Usage: node scripts/fetch-wix-product.js <productId> [--base-url <url>]');
  console.log('Example: node scripts/fetch-wix-product.js 0ca7369a-fe23-4f34-81ee-11e8fd7b4aca');
  console.log('Env placeholders: WIX_API_TOKEN, WIX_SITE_ID');
}

function hasNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseArgs(argv) {
  const args = argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  const productId = args[0];
  let baseUrl = DEFAULT_WIX_API_BASE_URL;

  for (let i = 1; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--base-url') {
      const next = args[i + 1];
      if (hasNonEmptyString(next)) {
        baseUrl = next;
        i += 1;
      }
    }
  }

  return { help: false, productId, baseUrl };
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => typeof item === 'string' && item.trim().length > 0);
}

function extractCollections(product) {
  const candidateArrays = [
    product?.collectionIds,
    product?.collections,
    product?.categoryIds,
    product?.categories,
    product?.additionalInfoSections,
  ];

  for (const candidate of candidateArrays) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate;
    }
  }

  return [];
}

function extractRevision(product) {
  const candidates = [
    product?.revision,
    product?._revision,
    product?.metadata?.revision,
    product?.meta?.revision,
  ];

  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      return candidate;
    }
  }

  return '(not provided by API response)';
}

function formatMetadata(product) {
  const tags = normalizeStringArray(product?.tags);
  const ribbon = product?.ribbon;
  const brand = product?.brand;

  return {
    tags,
    metadata: {
      brand: hasNonEmptyString(brand) ? brand : undefined,
      ribbon: hasNonEmptyString(ribbon) ? ribbon : undefined,
    },
  };
}

function buildHeaders(token, siteId) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  if (hasNonEmptyString(siteId)) {
    headers['wix-site-id'] = siteId;
  }

  return headers;
}

async function fetchProduct({ baseUrl, productId, token, siteId }) {
  const trimmedBase = baseUrl.replace(/\/+$/, '');
  const url = `${trimmedBase}/${encodeURIComponent(productId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(token, siteId),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Wix API request failed (${response.status} ${response.statusText}): ${details}`);
  }

  return response.json();
}

async function main() {
  const { help, productId, baseUrl } = parseArgs(process.argv);

  if (help) {
    printUsage();
    process.exit(0);
  }

  if (!hasNonEmptyString(productId)) {
    console.error('Error: productId is required.');
    printUsage();
    process.exit(1);
  }

  const token = process.env.WIX_API_TOKEN;
  const siteId = process.env.WIX_SITE_ID;

  if (!hasNonEmptyString(token)) {
    console.error('Error: Missing WIX_API_TOKEN environment variable.');
    console.error('This script is read-only, but authentication is still required for API access.');
    process.exit(1);
  }

  console.log('HatsRx Wix Product Fetcher (Read-Only)');
  console.log('======================================');
  console.log(`Product ID: ${productId}`);
  console.log(`API Base URL: ${baseUrl}`);
  console.log('Mode: READ ONLY (GET request only)');
  console.log('');

  try {
    const payload = await fetchProduct({ baseUrl, productId, token, siteId });
    const product = payload?.product || payload;

    const name = product?.name || '(missing)';
    const description = product?.description || product?.descriptionHtml || '(missing)';
    const { tags, metadata } = formatMetadata(product);
    const collections = extractCollections(product);
    const revision = extractRevision(product);

    console.log('Current product data:');
    console.log(`- name: ${name}`);
    console.log(`- description: ${description}`);
    console.log(`- tags: ${tags.length > 0 ? tags.join(', ') : '(none found)'}`);
    console.log(`- metadata: ${Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : '(none found)'}`);
    console.log(`- collections/categories: ${collections.length > 0 ? JSON.stringify(collections) : '(none found)'}`);
    console.log(`- revision: ${revision}`);
    console.log('');
    console.log('Safety check: No updates were sent. No files were modified.');
  } catch (error) {
    console.error('Error: Unable to fetch Wix product.');
    console.error(`Details: ${error.message}`);
    process.exit(1);
  }
}

main();
