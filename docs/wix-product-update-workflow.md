# Wix Product Update Workflow

## Purpose

Use approved JSON files to update existing HatsRx Wix products without manually rewriting every product page.

## Workflow

1. Create or update a product JSON file in `data/products/`.
2. Review the JSON for accuracy.
3. Confirm productSlug or productId matches an existing Wix product.
4. Run a Wix/Velo update script or API workflow.
5. Update only approved fields:
   - product name
   - product description
   - tags
   - collection assignment

## Do Not Update

- prices
- payments
- shipping
- subscriptions
- fulfillment
- publishing settings

## Safety Rule

No live Wix product should be updated unless the JSON file has been reviewed and approved.
