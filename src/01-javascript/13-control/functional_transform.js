// ============================================
// TASK 4: Functional data transformation
// ============================================
// Complete each TODO using map / filter / reduce / Set / Map / every / some.
// No for loops allowed.

const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999, inStock: true },
  { id: 2, name: 'Phone', category: 'Electronics', price: 699, inStock: false },
  { id: 3, name: 'Desk', category: 'Furniture', price: 350, inStock: true },
  { id: 4, name: 'Chair', category: 'Furniture', price: 199, inStock: true },
  { id: 5, name: 'Monitor', category: 'Electronics', price: 499, inStock: true },
];

// 1. Names of all in-stock products
const inStockNames = products.filter((p) => p.inStock).map((p) => p.name);
console.log(inStockNames);
// Expected: ['Laptop', 'Desk', 'Chair', 'Monitor']

// 2. Total price of in-stock products
const totalInStock = products.filter((p) => p.inStock).reduce((sum, p) => sum + p.price, 0);
console.log(totalInStock);
// Expected: 2047

// 3. Unique categories as an array (use Set)
const categories = [...new Set(products.map((p) => p.category))];
console.log(categories);
// Expected: ['Electronics', 'Furniture']

// 4. Product lookup: Map<id, name>
const catalog = new Map(products.map((p) => [p.id, p.name]));
console.log(catalog?.get(3));
// Expected: 'Desk'

// 5. Group product names by category
//    { Electronics: ['Laptop', 'Phone', 'Monitor'], Furniture: ['Desk', 'Chair'] }
const grouped = products.reduce((acc, p) => {
  if (!acc[p.category]) {
    acc[p.category] = [];
  }
  acc[p.category].push(p.name);
  return acc;
}, {});
console.log(grouped);

// 6. Most expensive in-stock product
const mostExpensive = products
  .filter((p) => p.inStock)
  .reduce((max, p) => (p.price > max.price ? p : max), { price: 0 });
console.log(mostExpensive?.name);
// Expected: 'Laptop'

// 7. Does every in-stock product cost less than $1000?
const allAffordable = products.filter((p) => p.inStock).every((p) => p.price < 1000);

console.log(allAffordable);
// Expected: true

// 8. Is there any Electronics product that is out of stock?
const hasOutOfStockElectronics = products
  .filter((p) => !p.inStock)
  .any((p) => p.category === 'Electronics')
  .console.log(hasOutOfStockElectronics);
// Expected: true  (Phone is Electronics and inStock: false)

// 9. Names of in-stock Electronics products, sorted by price descending
const expecnsiveElectronics = products
  .filter((p) => p.inStock && p.category === 'Electronics')
  .sort((a, b) => b.price - a.price)
  .map((p) => p.name);
console.log(expecnsiveElectronics);
// Expected: ['Laptop', 'Monitor']
