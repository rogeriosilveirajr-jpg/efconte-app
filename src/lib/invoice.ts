import prisma from "./prisma";

export async function addInvoiceItem(tenantId: string, description: string, amount: number) {
  // Find pending invoice for the current month/period, or create one
  const now = new Date();
  // We can just find the most recent Pending invoice
  let invoice = await prisma.invoice.findFirst({
    where: {
      tenantId,
      status: "Pending",
    },
    orderBy: { dueDate: "asc" }
  });

  if (!invoice) {
    // Create a new invoice due next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(5); // Due on the 5th
    
    // Check if there is an active subscription to get base plan value
    const subscription = await prisma.subscription.findFirst({
      where: { tenantId, active: true },
      include: { plan: true }
    });
    
    const baseAmount = subscription ? subscription.plan.basePrice : 0.0;
    
    invoice = await prisma.invoice.create({
      data: {
        tenantId,
        dueDate: nextMonth,
        totalAmount: baseAmount,
        status: "Pending"
      }
    });

    if (baseAmount > 0 && subscription) {
      await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
          description: `Mensalidade - ${subscription.plan.name}`,
          amount: baseAmount
        }
      });
    }
  }

  // Add the new avulso item
  const item = await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice.id,
      description,
      amount
    }
  });

  // Update invoice total
  const currentInvoice = await prisma.invoice.findUnique({ where: { id: invoice.id } });
  if (currentInvoice) {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        totalAmount: currentInvoice.totalAmount + amount
      }
    });
  }

  return item;
}
