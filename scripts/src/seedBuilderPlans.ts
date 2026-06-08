import { getUncachableRevenueCatClient } from "./revenueCatClient";

import {
  listProjects,
  listApps,
  listProducts,
  createProduct,
  listEntitlements,
  attachProductsToEntitlement,
  listOfferings,
  listPackages,
  createPackages,
  attachProductsToPackage,
  type App,
  type Product,
  type CreateProductData,
} from "@replit/revenuecat-sdk";

// Builder Basic — £14.90/month
const BASIC_IDENTIFIER = "buildmatch_builder_basic_monthly";
const BASIC_PLAY_IDENTIFIER = "buildmatch_builder_basic_monthly:monthly";
const BASIC_DISPLAY_NAME = "BuildMatch Builder Basic";
const BASIC_TITLE = "Builder Basic";
const BASIC_PACKAGE = "buildmatch_builder_basic";
const BASIC_PACKAGE_DISPLAY = "Builder Basic Monthly";

// Builder Pro — £24.90/month
const PRO_IDENTIFIER = "buildmatch_builder_pro_monthly";
const PRO_PLAY_IDENTIFIER = "buildmatch_builder_pro_monthly:monthly";
const PRO_DISPLAY_NAME = "BuildMatch Builder Pro";
const PRO_TITLE = "Builder Pro";
const PRO_PACKAGE = "buildmatch_builder_pro";
const PRO_PACKAGE_DISPLAY = "Builder Pro Monthly";

const DURATION = "P1M";

type TestStorePricesResponse = {
  object: string;
  prices: { amount_micros: number; currency: string }[];
};

async function seed() {
  const client = await getUncachableRevenueCatClient();
  const projectId = process.env.REVENUECAT_PROJECT_ID!;

  // ── Resolve project + apps ─────────────────────────────────────────────────
  const { data: projects, error: projErr } = await listProjects({ client, query: { limit: 20 } });
  if (projErr) throw new Error("Failed to list projects");
  const project = projects.items?.find((p) => p.name === "BuildMatch");
  if (!project) throw new Error("BuildMatch project not found");
  console.log("Project:", project.id);

  const { data: apps, error: appsErr } = await listApps({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (appsErr || !apps?.items.length) throw new Error("No apps found");

  const testApp = apps.items.find((a) => a.type === "test_store")!;
  const appStoreApp = apps.items.find((a) => a.type === "app_store")!;
  const playStoreApp = apps.items.find((a) => a.type === "play_store")!;
  console.log("Apps found:", testApp.id, appStoreApp.id, playStoreApp.id);

  // ── Products ───────────────────────────────────────────────────────────────
  const { data: existingProducts, error: prodErr } = await listProducts({
    client,
    path: { project_id: project.id },
    query: { limit: 100 },
  });
  if (prodErr) throw new Error("Failed to list products");

  const ensureProduct = async (
    targetApp: App,
    label: string,
    storeId: string,
    displayName: string,
    title: string,
    isTestStore: boolean,
  ): Promise<Product> => {
    const existing = existingProducts.items?.find(
      (p) => p.store_identifier === storeId && p.app_id === targetApp.id,
    );
    if (existing) {
      console.log(`${label} already exists:`, existing.id);
      return existing;
    }
    const body: CreateProductData["body"] = {
      store_identifier: storeId,
      app_id: targetApp.id,
      type: "subscription",
      display_name: displayName,
    };
    if (isTestStore) {
      body.subscription = { duration: DURATION };
      body.title = title;
    }
    const { data, error } = await createProduct({ client, path: { project_id: project.id }, body });
    if (error) throw new Error(`Failed to create ${label}: ${JSON.stringify(error)}`);
    console.log(`Created ${label}:`, data.id);
    return data;
  };

  const basicTest = await ensureProduct(testApp, "Basic (Test)", BASIC_IDENTIFIER, BASIC_DISPLAY_NAME, BASIC_TITLE, true);
  const basicAppStore = await ensureProduct(appStoreApp, "Basic (App Store)", BASIC_IDENTIFIER, BASIC_DISPLAY_NAME, BASIC_TITLE, false);
  const basicPlay = await ensureProduct(playStoreApp, "Basic (Play)", BASIC_PLAY_IDENTIFIER, BASIC_DISPLAY_NAME, BASIC_TITLE, false);

  const proTest = await ensureProduct(testApp, "Pro (Test)", PRO_IDENTIFIER, PRO_DISPLAY_NAME, PRO_TITLE, true);
  const proAppStore = await ensureProduct(appStoreApp, "Pro (App Store)", PRO_IDENTIFIER, PRO_DISPLAY_NAME, PRO_TITLE, false);
  const proPlay = await ensureProduct(playStoreApp, "Pro (Play)", PRO_PLAY_IDENTIFIER, PRO_DISPLAY_NAME, PRO_TITLE, false);

  // ── Test store prices ──────────────────────────────────────────────────────
  const addPrice = async (productId: string, label: string, priceMicros: number) => {
    const { error } = await client.post<TestStorePricesResponse>({
      url: "/projects/{project_id}/products/{product_id}/test_store_prices",
      path: { project_id: project.id, product_id: productId },
      body: {
        prices: [
          { amount_micros: priceMicros, currency: "GBP" },
          { amount_micros: priceMicros, currency: "USD" },
        ],
      },
    });
    if (error) {
      if (typeof error === "object" && "type" in error && (error as any).type === "resource_already_exists") {
        console.log(`${label} test prices already exist`);
      } else {
        throw new Error(`Failed to add ${label} test prices: ${JSON.stringify(error)}`);
      }
    } else {
      console.log(`Added ${label} test prices`);
    }
  };

  await addPrice(basicTest.id, "Basic", 14900000);
  await addPrice(proTest.id, "Pro", 24900000);

  // ── Attach to entitlement ──────────────────────────────────────────────────
  const { data: entitlements, error: entErr } = await listEntitlements({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (entErr) throw new Error("Failed to list entitlements");
  const entitlement = entitlements.items?.find((e) => e.lookup_key === "BuildMatch Pro");
  if (!entitlement) throw new Error("BuildMatch Pro entitlement not found");

  const { error: attachErr } = await attachProductsToEntitlement({
    client,
    path: { project_id: project.id, entitlement_id: entitlement.id },
    body: {
      product_ids: [basicTest.id, basicAppStore.id, basicPlay.id, proTest.id, proAppStore.id, proPlay.id],
    },
  });
  if (attachErr) {
    if (attachErr.type === "unprocessable_entity_error") {
      console.log("Products already attached to entitlement");
    } else {
      throw new Error("Failed to attach products to entitlement");
    }
  } else {
    console.log("Attached all products to BuildMatch Pro entitlement");
  }

  // ── Offering + packages ────────────────────────────────────────────────────
  const { data: offerings, error: offErr } = await listOfferings({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (offErr) throw new Error("Failed to list offerings");
  const offering = offerings.items?.find((o) => o.lookup_key === "default");
  if (!offering) throw new Error("Default offering not found");

  const { data: existingPkgs, error: pkgErr } = await listPackages({
    client,
    path: { project_id: project.id, offering_id: offering.id },
    query: { limit: 20 },
  });
  if (pkgErr) throw new Error("Failed to list packages");

  const ensurePackage = async (lookupKey: string, displayName: string) => {
    const existing = existingPkgs.items?.find((p) => p.lookup_key === lookupKey);
    if (existing) {
      console.log(`Package '${lookupKey}' already exists:`, existing.id);
      return existing;
    }
    const { data, error } = await createPackages({
      client,
      path: { project_id: project.id, offering_id: offering.id },
      body: { lookup_key: lookupKey, display_name: displayName },
    });
    if (error) throw new Error(`Failed to create package '${lookupKey}': ${JSON.stringify(error)}`);
    console.log(`Created package '${lookupKey}':`, data.id);
    return data;
  };

  const basicPkg = await ensurePackage(BASIC_PACKAGE, BASIC_PACKAGE_DISPLAY);
  const proPkg = await ensurePackage(PRO_PACKAGE, PRO_PACKAGE_DISPLAY);

  const attachPkg = async (pkg: typeof basicPkg, products: Product[], label: string) => {
    const { error } = await attachProductsToPackage({
      client,
      path: { project_id: project.id, package_id: pkg.id },
      body: {
        products: products.map((p) => ({ product_id: p.id, eligibility_criteria: "all" as const })),
      },
    });
    if (error) {
      if (error.type === "unprocessable_entity_error") {
        console.log(`${label} products already attached`);
      } else {
        throw new Error(`Failed to attach ${label} products: ${JSON.stringify(error)}`);
      }
    } else {
      console.log(`Attached products to ${label} package`);
    }
  };

  await attachPkg(basicPkg, [basicTest, basicAppStore, basicPlay], "Basic");
  await attachPkg(proPkg, [proTest, proAppStore, proPlay], "Pro");

  console.log("\n========================================");
  console.log("Builder plans setup complete!");
  console.log("Basic package ID: buildmatch_builder_basic");
  console.log("Pro package ID:   buildmatch_builder_pro");
  console.log("App Store product IDs to create in App Store Connect:");
  console.log("  buildmatch_builder_basic_monthly  — £14.90/mo");
  console.log("  buildmatch_builder_pro_monthly    — £24.90/mo");
  console.log("========================================\n");
}

seed().catch(console.error);
