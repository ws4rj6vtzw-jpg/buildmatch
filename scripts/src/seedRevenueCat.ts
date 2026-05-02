import { getUncachableRevenueCatClient } from "./revenueCatClient";

import {
  listProjects,
  createProject,
  listApps,
  createApp,
  listAppPublicApiKeys,
  listProducts,
  createProduct,
  listEntitlements,
  createEntitlement,
  attachProductsToEntitlement,
  listOfferings,
  createOffering,
  updateOffering,
  listPackages,
  createPackages,
  attachProductsToPackage,
  type App,
  type Product,
  type Project,
  type Entitlement,
  type Offering,
  type Package,
  type CreateProductData,
} from "@replit/revenuecat-sdk";

const PROJECT_NAME = "BuildMatch";

// Worker Pro — £9.99/month (for tradespeople)
const WORKER_PRODUCT_IDENTIFIER = "buildmatch_pro_worker_monthly";
const WORKER_PLAY_STORE_IDENTIFIER = "buildmatch_pro_worker_monthly:monthly";
const WORKER_PRODUCT_DISPLAY_NAME = "BuildMatch Pro — Worker";
const WORKER_PRODUCT_TITLE = "BuildMatch Pro Worker";

// Builder Pro — £49/month (for construction companies)
const BUILDER_PRODUCT_IDENTIFIER = "buildmatch_pro_builder_monthly";
const BUILDER_PLAY_STORE_IDENTIFIER = "buildmatch_pro_builder_monthly:monthly";
const BUILDER_PRODUCT_DISPLAY_NAME = "BuildMatch Pro — Builder";
const BUILDER_PRODUCT_TITLE = "BuildMatch Pro Builder";

const PRODUCT_DURATION = "P1M";

const APP_STORE_APP_NAME = "BuildMatch iOS";
const APP_STORE_BUNDLE_ID = "com.buildmatch.app";
const PLAY_STORE_APP_NAME = "BuildMatch Android";
const PLAY_STORE_PACKAGE_NAME = "com.buildmatch.app";

const ENTITLEMENT_IDENTIFIER = "BuildMatch Pro";
const ENTITLEMENT_DISPLAY_NAME = "BuildMatch Pro";

const OFFERING_IDENTIFIER = "default";
const OFFERING_DISPLAY_NAME = "Default Offering";

const WORKER_PACKAGE_IDENTIFIER = "$rc_monthly";
const WORKER_PACKAGE_DISPLAY_NAME = "Worker Monthly";
const BUILDER_PACKAGE_IDENTIFIER = "$rc_annual";
const BUILDER_PACKAGE_DISPLAY_NAME = "Builder Monthly";

type TestStorePricesResponse = {
  object: string;
  prices: { amount_micros: number; currency: string }[];
};

async function seedRevenueCat() {
  const client = await getUncachableRevenueCatClient();

  // ── Project ──────────────────────────────────────────────────────────────
  let project: Project;
  const { data: existingProjects, error: listProjectsError } = await listProjects({
    client,
    query: { limit: 20 },
  });
  if (listProjectsError) throw new Error("Failed to list projects");

  const existingProject = existingProjects.items?.find((p) => p.name === PROJECT_NAME);
  if (existingProject) {
    console.log("Project already exists:", existingProject.id);
    project = existingProject;
  } else {
    const { data: newProject, error } = await createProject({ client, body: { name: PROJECT_NAME } });
    if (error) throw new Error("Failed to create project");
    console.log("Created project:", newProject.id);
    project = newProject;
  }

  // ── Apps ──────────────────────────────────────────────────────────────────
  const { data: apps, error: listAppsError } = await listApps({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listAppsError || !apps || apps.items.length === 0) throw new Error("No apps found");

  let testApp: App | undefined = apps.items.find((a) => a.type === "test_store");
  let appStoreApp: App | undefined = apps.items.find((a) => a.type === "app_store");
  let playStoreApp: App | undefined = apps.items.find((a) => a.type === "play_store");

  if (!testApp) throw new Error("No test store app found");
  console.log("Test store app:", testApp.id);

  if (!appStoreApp) {
    const { data, error } = await createApp({
      client,
      path: { project_id: project.id },
      body: { name: APP_STORE_APP_NAME, type: "app_store", app_store: { bundle_id: APP_STORE_BUNDLE_ID } },
    });
    if (error) throw new Error("Failed to create App Store app");
    appStoreApp = data;
    console.log("Created App Store app:", appStoreApp.id);
  } else {
    console.log("App Store app:", appStoreApp.id);
  }

  if (!playStoreApp) {
    const { data, error } = await createApp({
      client,
      path: { project_id: project.id },
      body: { name: PLAY_STORE_APP_NAME, type: "play_store", play_store: { package_name: PLAY_STORE_PACKAGE_NAME } },
    });
    if (error) throw new Error("Failed to create Play Store app");
    playStoreApp = data;
    console.log("Created Play Store app:", playStoreApp.id);
  } else {
    console.log("Play Store app:", playStoreApp.id);
  }

  // ── Products ──────────────────────────────────────────────────────────────
  const { data: existingProducts, error: listProductsError } = await listProducts({
    client,
    path: { project_id: project.id },
    query: { limit: 100 },
  });
  if (listProductsError) throw new Error("Failed to list products");

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
      console.log(`${label} product already exists:`, existing.id);
      return existing;
    }
    const body: CreateProductData["body"] = {
      store_identifier: storeId,
      app_id: targetApp.id,
      type: "subscription",
      display_name: displayName,
    };
    if (isTestStore) {
      body.subscription = { duration: PRODUCT_DURATION };
      body.title = title;
    }
    const { data, error } = await createProduct({ client, path: { project_id: project.id }, body });
    if (error) throw new Error(`Failed to create ${label} product`);
    console.log(`Created ${label} product:`, data.id);
    return data;
  };

  const workerTestProduct = await ensureProduct(testApp, "Worker (Test)", WORKER_PRODUCT_IDENTIFIER, WORKER_PRODUCT_DISPLAY_NAME, WORKER_PRODUCT_TITLE, true);
  const workerAppProduct = await ensureProduct(appStoreApp, "Worker (App Store)", WORKER_PRODUCT_IDENTIFIER, WORKER_PRODUCT_DISPLAY_NAME, WORKER_PRODUCT_TITLE, false);
  const workerPlayProduct = await ensureProduct(playStoreApp, "Worker (Play Store)", WORKER_PLAY_STORE_IDENTIFIER, WORKER_PRODUCT_DISPLAY_NAME, WORKER_PRODUCT_TITLE, false);

  const builderTestProduct = await ensureProduct(testApp, "Builder (Test)", BUILDER_PRODUCT_IDENTIFIER, BUILDER_PRODUCT_DISPLAY_NAME, BUILDER_PRODUCT_TITLE, true);
  const builderAppProduct = await ensureProduct(appStoreApp, "Builder (App Store)", BUILDER_PRODUCT_IDENTIFIER, BUILDER_PRODUCT_DISPLAY_NAME, BUILDER_PRODUCT_TITLE, false);
  const builderPlayProduct = await ensureProduct(playStoreApp, "Builder (Play Store)", BUILDER_PLAY_STORE_IDENTIFIER, BUILDER_PRODUCT_DISPLAY_NAME, BUILDER_PRODUCT_TITLE, false);

  // ── Test Store Prices ─────────────────────────────────────────────────────
  const addTestPrice = async (productId: string, prices: { amount_micros: number; currency: string }[]) => {
    const { error } = await client.post<TestStorePricesResponse>({
      url: "/projects/{project_id}/products/{product_id}/test_store_prices",
      path: { project_id: project.id, product_id: productId },
      body: { prices },
    });
    if (error) {
      if (typeof error === "object" && "type" in error && error["type"] === "resource_already_exists") {
        console.log("Test store prices already exist for product:", productId);
      } else {
        throw new Error("Failed to add test store prices for product: " + productId);
      }
    } else {
      console.log("Added test store prices for product:", productId);
    }
  };

  await addTestPrice(workerTestProduct.id, [
    { amount_micros: 9990000, currency: "GBP" },
    { amount_micros: 9990000, currency: "USD" },
  ]);
  await addTestPrice(builderTestProduct.id, [
    { amount_micros: 49000000, currency: "GBP" },
    { amount_micros: 49000000, currency: "USD" },
  ]);

  // ── Entitlement ───────────────────────────────────────────────────────────
  let entitlement: Entitlement;
  const { data: existingEntitlements, error: listEntitlementsError } = await listEntitlements({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listEntitlementsError) throw new Error("Failed to list entitlements");

  console.log("Existing entitlements:", JSON.stringify(existingEntitlements.items?.map(e => ({ id: e.id, lookup_key: e.lookup_key }))));
  const existingEnt = existingEntitlements.items?.find(
    (e) => e.lookup_key === ENTITLEMENT_IDENTIFIER || (e as any).identifier === ENTITLEMENT_IDENTIFIER,
  );
  if (existingEnt) {
    console.log("Entitlement already exists:", existingEnt.id);
    entitlement = existingEnt;
  } else {
    const { data, error } = await createEntitlement({
      client,
      path: { project_id: project.id },
      body: { lookup_key: ENTITLEMENT_IDENTIFIER, display_name: ENTITLEMENT_DISPLAY_NAME },
    });
    if (error) {
      // Might already exist under a different field name — try to find it
      if (typeof error === "object" && "type" in error && (error as any).type === "resource_already_exists") {
        console.log("Entitlement already exists remotely, re-fetching...");
        const { data: refetch } = await listEntitlements({ client, path: { project_id: project.id }, query: { limit: 100 } });
        console.log("Re-fetched entitlements:", JSON.stringify(refetch?.items));
        const found = refetch?.items?.find((e: any) => e.lookup_key === ENTITLEMENT_IDENTIFIER || e.identifier === ENTITLEMENT_IDENTIFIER);
        if (!found) throw new Error("Could not find existing entitlement after resource_already_exists error");
        entitlement = found;
        console.log("Found existing entitlement:", entitlement.id);
      } else {
        console.error("Entitlement creation error:", JSON.stringify(error));
        throw new Error("Failed to create entitlement");
      }
    } else {
      console.log("Created entitlement:", data.id);
      entitlement = data;
    }
  }

  const { error: attachEntErr } = await attachProductsToEntitlement({
    client,
    path: { project_id: project.id, entitlement_id: entitlement.id },
    body: {
      product_ids: [
        workerTestProduct.id, workerAppProduct.id, workerPlayProduct.id,
        builderTestProduct.id, builderAppProduct.id, builderPlayProduct.id,
      ],
    },
  });
  if (attachEntErr) {
    if (attachEntErr.type === "unprocessable_entity_error") {
      console.log("Products already attached to entitlement");
    } else {
      throw new Error("Failed to attach products to entitlement");
    }
  } else {
    console.log("Attached all products to entitlement");
  }

  // ── Offering ──────────────────────────────────────────────────────────────
  let offering: Offering;
  const { data: existingOfferings, error: listOfferingsError } = await listOfferings({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listOfferingsError) throw new Error("Failed to list offerings");

  const existingOff = existingOfferings.items?.find((o) => o.lookup_key === OFFERING_IDENTIFIER);
  if (existingOff) {
    console.log("Offering already exists:", existingOff.id);
    offering = existingOff;
  } else {
    const { data, error } = await createOffering({
      client,
      path: { project_id: project.id },
      body: { lookup_key: OFFERING_IDENTIFIER, display_name: OFFERING_DISPLAY_NAME },
    });
    if (error) throw new Error("Failed to create offering");
    console.log("Created offering:", data.id);
    offering = data;
  }

  if (!offering.is_current) {
    const { error } = await updateOffering({
      client,
      path: { project_id: project.id, offering_id: offering.id },
      body: { is_current: true },
    });
    if (error) throw new Error("Failed to set offering as current");
    console.log("Set offering as current");
  }

  // ── Packages ──────────────────────────────────────────────────────────────
  const { data: existingPkgs, error: listPkgsError } = await listPackages({
    client,
    path: { project_id: project.id, offering_id: offering.id },
    query: { limit: 20 },
  });
  if (listPkgsError) throw new Error("Failed to list packages");

  const ensurePackage = async (lookupKey: string, displayName: string): Promise<Package> => {
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
    if (error) throw new Error(`Failed to create package '${lookupKey}'`);
    console.log(`Created package '${lookupKey}':`, data.id);
    return data;
  };

  const workerPkg = await ensurePackage(WORKER_PACKAGE_IDENTIFIER, WORKER_PACKAGE_DISPLAY_NAME);
  const builderPkg = await ensurePackage(BUILDER_PACKAGE_IDENTIFIER, BUILDER_PACKAGE_DISPLAY_NAME);

  const attachPkg = async (pkg: Package, products: Product[], label: string) => {
    const { error } = await attachProductsToPackage({
      client,
      path: { project_id: project.id, package_id: pkg.id },
      body: {
        products: products.map((p) => ({ product_id: p.id, eligibility_criteria: "all" as const })),
      },
    });
    if (error) {
      if (error.type === "unprocessable_entity_error") {
        console.log(`${label} products already attached to package`);
      } else {
        throw new Error(`Failed to attach products to ${label} package`);
      }
    } else {
      console.log(`Attached products to ${label} package`);
    }
  };

  await attachPkg(workerPkg, [workerTestProduct, workerAppProduct, workerPlayProduct], "Worker");
  await attachPkg(builderPkg, [builderTestProduct, builderAppProduct, builderPlayProduct], "Builder");

  // ── API Keys ──────────────────────────────────────────────────────────────
  const getKeys = async (app: App, label: string) => {
    const { data, error } = await listAppPublicApiKeys({
      client,
      path: { project_id: project.id, app_id: app.id },
    });
    if (error) throw new Error(`Failed to get public API keys for ${label}`);
    return data?.items.map((k) => k.key).join(", ") ?? "N/A";
  };

  const testKey = await getKeys(testApp, "Test Store");
  const iosKey = await getKeys(appStoreApp, "App Store");
  const androidKey = await getKeys(playStoreApp, "Play Store");

  console.log("\n====================");
  console.log("BuildMatch RevenueCat setup complete!");
  console.log("Project ID:", project.id);
  console.log("Test Store App ID:", testApp.id);
  console.log("App Store App ID:", appStoreApp.id);
  console.log("Play Store App ID:", playStoreApp.id);
  console.log("Entitlement Identifier:", ENTITLEMENT_IDENTIFIER);
  console.log("Public API Key - Test Store:", testKey);
  console.log("Public API Key - App Store:", iosKey);
  console.log("Public API Key - Play Store:", androidKey);
  console.log("\nSet these environment variables:");
  console.log("REVENUECAT_PROJECT_ID =", project.id);
  console.log("REVENUECAT_TEST_STORE_APP_ID =", testApp.id);
  console.log("REVENUECAT_APPLE_APP_STORE_APP_ID =", appStoreApp.id);
  console.log("REVENUECAT_GOOGLE_PLAY_STORE_APP_ID =", playStoreApp.id);
  console.log("EXPO_PUBLIC_REVENUECAT_TEST_API_KEY =", testKey);
  console.log("EXPO_PUBLIC_REVENUECAT_IOS_API_KEY =", iosKey);
  console.log("EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY =", androidKey);
  console.log("====================\n");
}

seedRevenueCat().catch(console.error);
