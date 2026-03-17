#!/usr/bin/env node

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const dbPort = Number(process.env.DB_PORT || 3306);

const demoPaintings = [
  {
    title: 'Golden Dunes',
    description: 'Warm evening light over layered dunes with a calm horizon.',
    price: 4200,
    image_url: '/uploads/demo-golden-dunes.svg',
    category: 'Landscape'
  },
  {
    title: 'Forest Silence',
    description: 'A quiet woodland composition with soft fog and deep green tones.',
    price: 5100,
    image_url: '/uploads/demo-forest-silence.svg',
    category: 'Nature'
  },
  {
    title: 'Blue Horizon',
    description: 'Minimal seascape with layered blue gradients and distant light.',
    price: 4700,
    image_url: '/uploads/demo-blue-horizon.svg',
    category: 'Seascape'
  }
];

const demoOrders = [
  {
    customer_name: 'Olena Kovalenko',
    customer_email: 'demo-order-1@example.com',
    customer_phone: '+380501112233',
    customer_comment: 'Please call before delivery.',
    status: 'pending',
    paintingTitle: 'Golden Dunes'
  },
  {
    customer_name: 'Taras Melnyk',
    customer_email: 'demo-order-2@example.com',
    customer_phone: '+380671234567',
    customer_comment: 'Gift wrap requested.',
    status: 'in_process',
    paintingTitle: 'Forest Silence'
  },
  {
    customer_name: 'Iryna Shevchenko',
    customer_email: 'demo-order-3@example.com',
    customer_phone: '+380931234567',
    customer_comment: 'Deliver after 18:00.',
    status: 'shipped',
    paintingTitle: 'Blue Horizon'
  }
];

async function upsertPainting(pool, painting) {
  const [rows] = await pool.execute('SELECT id FROM paintings WHERE title = ? LIMIT 1', [painting.title]);
  const existing = rows[0];

  if (existing) {
    await pool.execute(
      'UPDATE paintings SET description = ?, price = ?, image_url = ?, category = ? WHERE id = ?',
      [painting.description, painting.price, painting.image_url, painting.category, existing.id]
    );
    return existing.id;
  }

  const [result] = await pool.execute(
    'INSERT INTO paintings (title, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)',
    [painting.title, painting.description, painting.price, painting.image_url, painting.category]
  );

  return result.insertId;
}

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number.isNaN(dbPort) ? 3306 : dbPort,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'art_shop',
    connectionLimit: 5,
  });

  try {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    await pool.execute(
      'INSERT INTO admin (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
      [adminUsername, passwordHash]
    );

    const paintingIds = {};
    for (const painting of demoPaintings) {
      paintingIds[painting.title] = await upsertPainting(pool, painting);
    }

    await pool.execute(
      'DELETE FROM orders WHERE customer_email IN (?, ?, ?)',
      demoOrders.map((order) => order.customer_email)
    );

    for (const order of demoOrders) {
      const totalAmount = demoPaintings.find((painting) => painting.title === order.paintingTitle).price;
      const [orderResult] = await pool.execute(
        'INSERT INTO orders (customer_name, customer_email, customer_phone, customer_comment, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)',
        [
          order.customer_name,
          order.customer_email,
          order.customer_phone,
          order.customer_comment,
          totalAmount,
          order.status,
        ]
      );

      await pool.execute(
        'INSERT INTO order_items (order_id, painting_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, paintingIds[order.paintingTitle], 1, totalAmount]
      );
    }

    console.log('Demo seed completed.');
    console.log(`Admin login: ${adminUsername}`);
    console.log(`Admin password: ${adminPassword}`);
    console.log(`Paintings seeded: ${demoPaintings.length}`);
    console.log(`Orders seeded: ${demoOrders.length}`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Demo seed failed:', error);
    await pool.end();
    process.exit(1);
  }
})();