import express from "express";
import ProductManager from './ProductManager.js';

const app = express();
const productManager = new ProductManager('./products.json');
const PORT = process.env.PORT || 8080;

app.get('/products', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : null;
      let products = await productManager.getProducts();
      if (limit !== null && !isNaN(limit)) {
        products = products.slice(0, limit);
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.get('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Sorry, the product you are looking for does not exist' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`This server is running on port ${PORT}`);
});