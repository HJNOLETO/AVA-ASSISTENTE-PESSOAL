
import "dotenv/config";
import { createCustomer, getDb } from "./server/db";
import { customers } from "./drizzle/schema";
import { eq } from "drizzle-orm";

async function testCreateCustomer() {
  try {
    console.log("Testing createCustomer...");
    
    // Ensure DB is initialized
    await getDb();

    // Mock user ID (admin is usually 1)
    const userId = 1;

    // Data with missing optional fields (cpf, addressCity)
    const customerData = {
      name: "Test Customer " + Date.now(),
      email: "test@example.com",
      phone: "1234567890",
      // cpf: undefined, // Should be allowed
      // addressCity: undefined, // Should be allowed
      status: "active" as const
    };

    console.log("Creating customer with data:", JSON.stringify(customerData, null, 2));
    const result = await createCustomer(userId, customerData);
    console.log("Customer created result:", result);

    // Verify it exists in DB
    const db = await getDb();
    if (!db) throw new Error("DB not available");
    
    const created = await db.select().from(customers).where(eq(customers.name, customerData.name)).get();
    
    if (created) {
        console.log("✅ Customer found in DB:", created);
        if (created.cpf === null && created.addressCity === null) {
             console.log("✅ Optional fields are null as expected.");
        } else {
             console.log("⚠️ Optional fields are NOT null:", created);
        }
    } else {
        console.error("❌ Customer NOT found in DB");
    }

  } catch (error) {
    console.error("❌ Error in testCreateCustomer:", error);
  }
}

testCreateCustomer();
