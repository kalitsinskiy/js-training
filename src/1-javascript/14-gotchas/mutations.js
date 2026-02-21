// ============================================
// MUTATIONS GOTCHAS
// ============================================

// ============================================
// 1. const не захищає від мутації
// ============================================
console.log('=== const не робить обʼєкт незмінним ===');

const user = { name: 'Alice', age: 25 };
user.age = 99;        // ✅ ok — мутуємо вміст, не перевизначаємо змінну
user.role = 'admin';  // ✅ ok — додаємо поле
console.log(user);    // { name: 'Alice', age: 99, role: 'admin' }

// user = {};  // ❌ TypeError — не можна перевизначити саму змінну

const arr = [1, 2, 3];
arr.push(4);          // ✅ ok — мутуємо масив
console.log(arr);     // [1, 2, 3, 4]

// arr = [];  // ❌ TypeError

// ✅ Хочеш справжню незмінність — Object.freeze():
const point = Object.freeze({ x: 1, y: 2 });
point.x = 999;         // ❌ мовчки ігнорується (або TypeError у strict mode)
console.log(point.x);  // 1 — не змінилося

// ---
// ============================================
// 2. Mutating vs Non-mutating методи масивів
// ============================================
console.log('\n=== Mutating vs Non-mutating методи масивів ===');

const original = [3, 1, 2];

// ❌ МУТУЮТЬ оригінал:
const sorted = original.sort();   // сортує original на місці!
console.log(original);            // [1, 2, 3] ← оригінал змінено
console.log(sorted === original); // true ← це одне і те ж

const nums = [1, 2, 3];
nums.reverse();    // мутує
nums.push(4);      // мутує
nums.pop();        // мутує
nums.shift();      // мутує
nums.unshift(0);   // мутує
nums.splice(1, 1); // мутує
nums.fill(0);      // мутує
console.log('після мутацій:', nums);

// ✅ НЕ мутують — повертають новий масив або значення:
const data = [3, 1, 2];
const mapped   = data.map(x => x * 2);    // новий масив
const filtered = data.filter(x => x > 1); // новий масив
const sliced   = data.slice(0, 2);         // новий масив
const concat   = data.concat([4, 5]);      // новий масив
const spread   = [...data].sort();         // .sort() на КОПІЇ

console.log(data);    // [3, 1, 2] ← незмінний
console.log(spread);  // [1, 2, 3]

// ✅ Безпечне сортування завжди:
const safeSorted = [...original].sort((a, b) => a - b);

// ---
// ============================================
// 3. Обʼєкти передаються за посиланням
// ============================================
console.log('\n=== Обʼєкти та масиви — за посиланням ===');

// ❌ Присвоєння — не копія, а ще одне посилання
const a = { x: 1 };
const b = a;
b.x = 99;
console.log(a.x); // 99 ← а теж змінився!

// ❌ Та сама пастка з масивами
const list = [1, 2, 3];
const alias = list;
alias.push(4);
console.log(list); // [1, 2, 3, 4] ← original змінено

// ✅ Поверхнева копія (spread або Object.assign):
const copy1 = { ...a };
const copy2 = Object.assign({}, a);
copy1.x = 1000;
console.log(a.x); // 99 ← оригінал захищений

// ⚠️ Але spread — ПОВЕРХНЕВА копія:
const nested = { inner: { val: 1 } };
const shallow = { ...nested };
shallow.inner.val = 999; // inner — все ще спільний обʼєкт!
console.log(nested.inner.val); // 999 ← пастка!

// ✅ Глибока копія (для простих обʼєктів без Date/Function/undefined):
const deep = JSON.parse(JSON.stringify(nested));
deep.inner.val = 0;
console.log(nested.inner.val); // 999 ← захищений

// ✅ Або структурне клонування (Node.js 17+, браузери 2022+):
// const deepClone = structuredClone(nested);

// ---
// ============================================
// 4. Мутація параметрів функції
// ============================================
console.log('\n=== Мутація параметрів функції ===');

// ❌ Функція непомітно мутує аргумент
function normalize(user) {
  user.name = user.name.trim().toLowerCase(); // мутує оригінал!
  return user;
}

const profile = { name: '  Alice  ' };
normalize(profile);
console.log(profile.name); // 'alice' ← оригінал змінено без попередження

// ✅ Повертати новий обʼєкт:
function normalizePure(user) {
  return { ...user, name: user.name.trim().toLowerCase() };
}

const profile2 = { name: '  Bob  ' };
const normalized = normalizePure(profile2);
console.log(profile2.name);   // '  Bob  ' ← незмінний
console.log(normalized.name); // 'bob'

// ❌ Пастка з масивом:
function addDefaults(config, defaults) {
  return Object.assign(config, defaults); // мутує config!
}

const myConfig = { debug: true };
addDefaults(myConfig, { timeout: 5000, retries: 3 });
console.log(myConfig); // { debug: true, timeout: 5000, retries: 3 } ← мутований!

// ✅ Безпечний варіант:
function mergeDefaults(config, defaults) {
  return { ...defaults, ...config }; // config має пріоритет
}

// ---
// ============================================
// 5. Object.freeze — тільки перший рівень
// ============================================
console.log('\n=== Object.freeze — shallow freeze ===');

const config = Object.freeze({
  db: { host: 'localhost', port: 5432 },
  maxRetries: 3,
});

config.maxRetries = 99; // ігнорується
console.log(config.maxRetries); // 3 ✅

config.db.host = 'hacked!'; // ← вкладений обʼєкт НЕ заморожений!
console.log(config.db.host); // 'hacked!' ← пастка!

// ✅ Глибоке заморожування (рекурсивно):
function deepFreeze(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}

const safeConfig = deepFreeze({ db: { host: 'localhost' } });
safeConfig.db.host = 'hacked'; // ігнорується / TypeError у strict mode
console.log(safeConfig.db.host); // 'localhost' ✅

// ---
// ============================================
// 6. Мутація всередині .forEach / .map
// ============================================
console.log('\n=== Мутація всередині map/forEach ===');

const users = [
  { name: 'alice', active: true },
  { name: 'bob',   active: false },
];

// ❌ map, що мутує — антипатерн:
const result = users.map(u => {
  u.name = u.name.toUpperCase(); // мутує оригінал!
  return u;
});

console.log(users[0].name); // 'ALICE' ← оригінал змінено!
console.log(result[0] === users[0]); // true ← той самий обʼєкт

// ✅ map повинен повертати НОВІ обʼєкти:
const users2 = [
  { name: 'alice', active: true },
  { name: 'bob',   active: false },
];

const result2 = users2.map(u => ({ ...u, name: u.name.toUpperCase() }));
console.log(users2[0].name);  // 'alice' ← незмінний ✅
console.log(result2[0].name); // 'ALICE'
