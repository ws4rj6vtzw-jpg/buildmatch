import { getUncachableRevenueCatClient } from "./revenueCatClient";
import { listApps, listProducts, listOfferings, listPackages } from "@replit/revenuecat-sdk";

async function check() {
  const client = await getUncachableRevenueCatClient();
  const projectId = process.env.REVENUECAT_PROJECT_ID!;

  const { data: apps } = await listApps({ client, path: { project_id: projectId }, query: { limit: 20 } });
  console.log("Apps:");
  apps?.items.forEach(a => {
    const storeInfo = (a as any).app_store || (a as any).play_store || {};
    console.log(" ", a.type, a.id, JSON.stringify(storeInfo));
  });

  const { data: offerings } = await listOfferings({ client, path: { project_id: projectId }, query: { limit: 20 } });
  const current = offerings?.items.find(o => o.is_current);
  console.log("\nCurrent offering:", current?.lookup_key, current?.id, "is_current:", current?.is_current);

  if (current) {
    const { data: pkgs } = await listPackages({ client, path: { project_id: projectId, offering_id: current.id }, query: { limit: 20 } });
    console.log("Packages:", pkgs?.items.map(p => p.lookup_key + " (" + p.id + ")"));
  }

  const { data: products } = await listProducts({ client, path: { project_id: projectId }, query: { limit: 100 } });
  console.log("\nProducts:");
  products?.items.forEach(p => console.log(" ", p.store_identifier, "| app_id:", p.app_id));
}

check().catch(console.error);
