const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../config/db');

const createCheckoutSession = async (req, res) => {
  try {
    const { cart, user_id } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'السلة فارغة' });
    }

    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'sar',
        product_data: {
          name: item.title,
          ...(item.image_url && { images: [item.image_url] }),
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Store cart as compact "productId:qty,..." string in metadata
    const cartMeta = cart.map((i) => `${i.product_id}:${i.quantity}`).join(',');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        cart_items: cartMeta,
        user_id: user_id ? String(user_id) : '',
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe createCheckoutSession error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      const cartItems = session.metadata.cart_items.split(',').map((s) => {
        const [product_id, quantity] = s.split(':');
        return { product_id: parseInt(product_id), quantity: parseInt(quantity) };
      });
      const user_id = session.metadata.user_id || null;

      await prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const processedItems = [];

        for (const item of cartItems) {
          const product = await tx.products.findUnique({ where: { id: item.product_id } });
          if (!product) throw new Error(`Product ${item.product_id} not found`);
          if (product.quantity < item.quantity) throw new Error(`Insufficient stock: ${product.title}`);

          totalAmount += Number(product.price) * item.quantity;

          await tx.products.update({
            where: { id: item.product_id },
            data: { quantity: { decrement: item.quantity } },
          });

          processedItems.push({
            product_id: product.id,
            quantity: item.quantity,
            price: product.price,
          });
        }

        const vatAmount = totalAmount * 0.15;

        await tx.orders.create({
          data: {
            user_id: user_id ? parseInt(user_id) : null,
            total_amount: totalAmount,
            vat_amount: vatAmount,
            payment_method: 'Stripe',
            status: 'completed',
            order_items: {
              create: processedItems.map((i) => ({
                product_id: i.product_id,
                quantity: i.quantity,
                price: i.price,
              })),
            },
          },
        });
      });

      console.log('✅ Order created from Stripe session:', session.id);
    } catch (err) {
      console.error('❌ Order creation failed:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };
