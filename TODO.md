# TODO: Create Separate Websites for Zepto, Jiomart, and Bigbasket

## Step 1: Create new directories and copy demosites structure

- [x] Create zepto-site directory and copy demosites contents
- [x] Create jiomart-site directory and copy demosites contents
- [x] Create bigbasket-site directory and copy demosites contents

## Step 2: Update API routes for Zepto site

- [x] Update zepto-site/app/api/products/route.ts to use product.prices?.zepto
- [x] Update zepto-site/app/api/products/[category]/route.ts to use product.prices?.zepto
- [x] Update zepto-site/app/api/products/search/route.ts to use product.prices?.zepto
- [x] Update zepto-site/package.json dev script to run on port 3001

## Step 3: Update API routes for Jiomart site

- [x] Update jiomart-site/app/api/products/route.ts to use product.prices?.jiomart
- [x] Update jiomart-site/app/api/products/[category]/route.ts to use product.prices?.jiomart
- [x] Update jiomart-site/app/api/products/search/route.ts to use product.prices?.jiomart
- [x] Update jiomart-site/package.json dev script to run on port 3002

## Step 4: Update API routes for Bigbasket site

- [x] Update bigbasket-site/app/api/products/route.ts to use product.prices?.bigbasket
- [x] Update bigbasket-site/app/api/products/[category]/route.ts to use product.prices?.bigbasket
- [x] Update bigbasket-site/app/api/products/search/route.ts to use product.prices?.bigbasket
- [x] Update bigbasket-site/package.json dev script to run on port 3003

## Step 5: Test each site

- [x] Run and verify Zepto site on port 3001
- [x] Run and verify Jiomart site on port 3002
- [x] Run and verify Bigbasket site on port 3003
