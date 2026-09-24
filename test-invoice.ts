import prisma from "./src/lib/prisma";
import { addInvoiceItem } from "./src/lib/invoice";

async function run() {
  try {
    // We need a tenant id
    const tenant = await prisma.tenant.findFirst();
    console.log("Tenant:", tenant?.id);
    if(tenant) {
      await addInvoiceItem(tenant.id, "Teste", 100);
      console.log("Success");
    }
  } catch (e) {
    console.error("Failed:", e);
  }
}
run();
