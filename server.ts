import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";
const ORDERS_FILE = path.join(process.cwd(), "orders.json");

// Middleware to parse incoming request bodies
app.use(express.json());

// Helper to read orders from orders.json
function readOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading orders file:", error);
  }
  return [];
}

// Helper to write orders to orders.json
function writeOrders(orders: any[]): boolean {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing orders file:", error);
    return false;
  }
}

// API: Get all orders
app.get("/api/orders", (req, res) => {
  const orders = readOrders();
  // Return orders sorted by creation date descending
  res.json(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

// API: Submit a new order
app.post("/api/orders", (req, res) => {
  const { customerName, phone, wilayaCode, wilayaName, shippingType, shippingFee, productPrice, totalPrice, comment } = req.body;

  if (!customerName || !phone || !wilayaCode || !wilayaName) {
    return res.status(400).json({ error: "الرجاء ملء جميع الحقول المطلوبة (الاسم، الهاتف، الولاية)" });
  }

  const orders = readOrders();
  const newOrder = {
    id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerName,
    phone,
    wilayaCode,
    wilayaName,
    shippingType,
    shippingFee: Number(shippingFee),
    productPrice: Number(productPrice),
    totalPrice: Number(totalPrice),
    comment: comment || "",
    status: 'new',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  const success = writeOrders(orders);

  if (success) {
    res.status(201).json(newOrder);
  } else {
    res.status(500).json({ error: "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى." });
  }
});

// API: Update order status
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "حالة الطلب مطلوبة" });
  }

  const orders = readOrders();
  const orderIndex = orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: "الطلب غير موجود" });
  }

  orders[orderIndex].status = status;
  const success = writeOrders(orders);

  if (success) {
    res.json(orders[orderIndex]);
  } else {
    res.status(500).json({ error: "فشل تحديث حالة الطلب" });
  }
});

// API: Delete an order
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const orders = readOrders();
  const filteredOrders = orders.filter(o => o.id !== id);

  if (orders.length === filteredOrders.length) {
    return res.status(404).json({ error: "الطلب غير موجود" });
  }

  const success = writeOrders(filteredOrders);
  if (success) {
    res.json({ success: true, message: "تم حذف الطلب بنجاح" });
  } else {
    res.status(500).json({ error: "فشل حذف الطلب" });
  }
});

// Setup Vite or Serve Static Files
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production router loaded.");
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});
