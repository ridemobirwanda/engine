// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Simple router
interface Route {
  method: string;
  path: string;
  handler: (request: Request, env: any, params: any) => Promise<Response> | Response;
}

const routes: Route[] = [];

function addRoute(method: string, path: string, handler: (request: Request, env: any, params: any) => Promise<Response> | Response) {
  routes.push({ method, path, handler });
}

function matchRoute(method: string, pathname: string) {
  for (const route of routes) {
    if (route.method !== method) continue;

    const pathParts = pathname.split('/').filter(Boolean);
    const routeParts = route.path.split('/').filter(Boolean);

    if (pathParts.length !== routeParts.length) continue;

    const params: any = {};
    let match = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) return { route, params };
  }
  return null;
}

// Health check endpoint
addRoute('GET', '/api/health', () => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    headers: corsHeaders,
  });
});

// Get all products
addRoute('GET', '/api/products', async (request, env) => {
  try {
    const db = env.enginemarket;
    const products = await db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(products.results || []), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get product by ID
addRoute('GET', '/api/products/:id', async (request, env, params) => {
  try {
    const db = env.enginemarket;
    const product = await db.prepare('SELECT * FROM products WHERE id = ?').bind(params.id).first();

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(product), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get all categories
addRoute('GET', '/api/categories', async (request, env) => {
  try {
    const db = env.enginemarket;
    const categories = await db.prepare('SELECT * FROM categories ORDER BY name').all();
    return new Response(JSON.stringify(categories.results || []), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get products by category
addRoute('GET', '/api/categories/:category/products', async (request, env, params) => {
  try {
    const db = env.enginemarket;
    const products = await db
      .prepare('SELECT * FROM products WHERE category = ? ORDER BY created_at DESC')
      .bind(params.category)
      .all();
    return new Response(JSON.stringify(products.results || []), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get user orders
addRoute('GET', '/api/users/:userId/orders', async (request, env, params) => {
  try {
    const db = env.enginemarket;
    const orders = await db
      .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
      .bind(params.userId)
      .all();
    return new Response(JSON.stringify(orders.results || []), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get order details
addRoute('GET', '/api/orders/:orderId', async (request, env, params) => {
  try {
    const db = env.enginemarket;

    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(params.orderId).first();

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const items = await db
      .prepare('SELECT * FROM order_items WHERE order_id = ?')
      .bind(params.orderId)
      .all();

    return new Response(JSON.stringify({ ...order, items: items.results || [] }), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Get user cart
addRoute('GET', '/api/users/:userId/cart', async (request, env, params) => {
  try {
    const db = env.enginemarket;

    const cartItems = await db
      .prepare(`
        SELECT c.*, p.name, p.price, p.image_url
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `)
      .bind(params.userId)
      .all();

    return new Response(JSON.stringify(cartItems.results || []), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Add to cart
addRoute('POST', '/api/users/:userId/cart', async (request, env, params) => {
  try {
    const db = env.enginemarket;
    const body = await request.json() as any;
    const { product_id, quantity } = body;

    if (!product_id || !quantity) {
      return new Response(JSON.stringify({ error: 'Missing product_id or quantity' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const result = await db
      .prepare('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)')
      .bind(params.userId, product_id, quantity)
      .run();

    return new Response(JSON.stringify({ success: true, id: (result as any).meta.last_row_id }), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Main fetch handler
export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Match route
    const match = matchRoute(method, pathname);

    if (match) {
      return await match.route.handler(request, env, match.params);
    }

    // 404
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: corsHeaders,
    });
  }
};

