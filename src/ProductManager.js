import fs from 'fs';

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProductsFromFile();
    }

    async loadProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'No such file') {
                throw new Error(`Upps something went wrong loading product from the file: ${error.message}`);
            }
        }
    }

    async saveProductsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            throw new Error(`Upps something went wrong saving the product to the file ${error.message}`);
        }
    }

    generateId() {
        const pastId = this.products.length === 0 ? 0 : this.products[this.products.length - 1].id;
        return pastId + 1;
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('All fields are required, please check');
        }

        if (this.products.some(product => product.code === code)) {
            throw new Error('The product code is in use');
        }

        const id = this.generateId();

        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        await this.saveProductsToFile();
        return id;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(productId) {
        const product = this.products.find(product => product.id === productId);

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    }

    async updateProduct(productId, updatedFields) {
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            await this.saveProductsToFile();
        } else {
            throw new Error('Product not found');
        }
    }

    async deleteProduct(productId) {
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.id !== productId);
        if (this.products.length !== initialLength) {
            await this.saveProductsToFile();
            return true;
        } else {
            throw new Error('Product not found');
        }
    }
}

const productManager = new ProductManager('./products.json');

export default ProductManager;
