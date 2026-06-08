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

const ELITE_IDENTIFIER = "buildmatch_builder_elite_monthly";
const ELITE_PLAY_IDENTIFIER = "buildmatch_builder_elite_monthly:monthly";
const ELITE_DISPLAY_NAME = "BuildMatch Builder Elite";
const ELITE_TITLE = "Builder Elite";
const ELITE_PACKAGE = "buildmatch_builder_elite";
const ELITE_PACKAGE_DISPLAY = "Builder Elite Monthly";
const DURATION = "P1M";

type TestStorePricesResponse = {
  object: string;
  prices: { amount_micros: number; currency: string }[];
};

async function seed() {
  const client = await getUncachableRevenueCatClient();

  const { data: projects } = await listProjects({ client, query: { limit: 20 } });
  const project = projects.items?.find((p) => p.name === "BuildMatch");
  if (!project) throw new Error("BuildMatch project not found");

  const { data: apps } = await listApps({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (!apps?.items.length) throw new Error("No apps found");

  const testApp = apps.items.find((a) => a.type === "test_store")!;
  const appStoreApp = apps.items.find((a) => a.type === "app_store")!;
  const playStoreApp = apps.items.find((a) => a.type === "play_store")!;

  const { data: existingProducts } = await listProducts({
    client,
    path: { project_id: project.id },
    query: { limit: 100 },
  });

  const ensureProduct = async (
    targetApp: App,
    label: string,
    storeId: string,
    isTestStore: boolean,
  ): Promise<Product> => {
    const existing = existingProducts.items?.find(
      (p) => p.store_identifier === storeId && p.app_id === targetApp.id,
    );
    if (existing) { console.log(`${label} already exists:`, existing.id); return existing; }
    const body: CreateProductData["body"] = {
      store_identifier: storeId,
      app_id: targetApp.id,
      type: "subscription",
      display_name: ELITE_DISPLAY_NAME,
    };
    if (isTestStore) {
      body.subscription = { duration: DURATION };
      body.title = ELITE_TITLE;
    }
    const { data, error } = await createProduct({ client, path: { project_id: project.id }, body });
    if (error) throw new Error(`Failed to create ${label}: ${JSON.stringify(error)}`);
    console.log(`Created ${label}:`, data.id);
    return data;
  };

  const eliteTest = await ensureProduct(testApp, "Elite (Test)", ELITE_IDENTIFIER, true);
  const eliteAppStore = await ensureProduct(appStoreApp, "Elite (App Store)", ELITE_IDENTIFIER, false);
  const elitePlay = await ensureProduct(playStoreApp, "Elite (Play)", ELITE_PLAY_IDENTIFIER, false);

  // Test store price — £49.90/mo
  const { error: priceErr } = await client.post<TestStorePricesResponse>({
    url: "/projects/{project_id}/products/{product_id}/test_store_prices",
    path: { project_id: project.id, product_id: eliteTest.id },
    body: {
      prices: [
        { amount_micros: 49900000, currency: "GBP" },
        { amount_micros: 49900000, currency: "USD" },
      ],
    },
  });
  if (priceErr) {
    if (typeof priceErr === "object" && "type" in priceErr && (priceErr as any).type === "resource_already_exists") {
      console.log("Elite test prices already exist");
    } else {
      throw new Error(`Failed to add Elite test prices: ${JSON.stringify(priceErr)}`);
    }
  } else {
    console.log("Added Elite test prices (£49.90)");
  }

  // Attach to entitlement
  const { data: entitlements } = await listEntitlements({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  const entitlement = entitlements.items?.find((e) => e.lookup_key === "BuildMatch Pro");
  if (!entitlement) throw new Error("BuildMatch Pro entitlement not found");

  const { error: attachErr } = await attachProductsToEntitlement({
    client,
    path: { project_id: project.id, entitlement_id: entitlement.id },
    body: { product_ids: [eliteTest.id, eliteAppStore.id, elitePlay.id] },
  });
  if (attachErr && (attachErr as any).type !== "unprocessable_entity_error") {
    throw new Error("Failed to attach products to entitlement");
  }
  console.log("Attached Elite products to BuildMatch Pro entitlement");

  // Create package
  const { data: offerings } = await listOfferings({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  const offering = offerings.items?.find((o) => o.lookup_key === "default");
  if (!offering) throw new Error("Default offering not found");

  const { data: existingPkgs } = await listPackages({
    client,
    path: { project_id: project.id, offering_id: offering.id },
    query: { limit: 20 },
  });

  const existingPkg = existingPkgs.items?.find((p) => p.lookup_key === ELITE_PACKAGE);
  let elitePkg = existingPkg;
  if (!existingPkg) {
    const { data, error } = await createPackages({
      client,
      path: { project_id: project.id, offering_id: offering.id },
      body: { lookup_key: ELITE_PACKAGE, display_name: ELITE_PACKAGE_DISPLAY },
    });
    if (error) throw new Error(`Failed to create Elite package: ${JSON.stringify(error)}`);
    elitePkg = data;
    console.log("Created Elite package:", data.id);
  } else {
    console.log("Elite package already exists:", existingPkg.id);
  }

  const { error: pkgAttachErr } = await attachProductsToPackage({
    client,
    path: { project_id: project.id, package_id: elitePkg!.id },
    body: {
      products: [
        { product_id: eliteTest.id, eligibility_criteria: "all" as const },
        { product_id: eliteAppStore.id, eligibility_criteria: "all" as const },
        { product_id: elitePlay.id, eligibility_criteria: "all" as const },
      ],
    },
  });
  if (pkgAttachErr && (pkgAttachErr as any).type !== "unprocessable_entity_error") {
    throw new Error(`Failed to attach Elite products: ${JSON.stringify(pkgAttachErr)}`);
  }
  console.log("Attached products to Elite package");

  console.log("\n========================================");
  console.log("Elite plan setup complete!");
  console.log("Package ID:  buildmatch_builder_elite");
  console.log("App Store product ID to create: buildmatch_builder_elite_monthly — £49.90/mo");
  console.log("========================================\n");
}

seed().catch(console.error);
