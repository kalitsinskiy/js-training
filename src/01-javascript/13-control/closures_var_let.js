// ============================================
// TASK 3: Closures, var vs let, factory state
// ============================================
// What does this code output? Explain why.

// --- Part 1 ---
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push({ val: i, fn: () => i }); // intentional: var closure trap
}

console.log(fns[0].val, fns[0].fn()); // ? 0 3
console.log(fns[2].val, fns[2].fn()); // ? 2 3

// --- Part 2 ---
function makePlugin(id, registry) {
  let uses = 0;
  registry.push(id);
  return {
    id,
    run() {
      uses++;
      return `${this.id}:${uses}`;
    },
    stats: () => ({ id, uses }),
  };
}

const reg = [];
const p1 = makePlugin('A', reg);
const p2 = makePlugin('B', reg);

console.log(p1.run()); // ? 'A:1'
console.log(p1.run()); // ? 'A:2'
console.log(p2.run()); // ? 'B:1'
console.log(reg); // ? ['A', 'B']

// --- Part 3 ---
const { run } = p1;
console.log(run()); // ? 'undefined:3'
console.log(p1.stats()); // ? { id: 'A', uses: 3 }
console.log(p2.stats()); // ? { id: 'B', uses: 1 }

const allVals = fns.map((f) => f.fn()).concat(reg);
console.log(allVals); // ? [0, 1, 2, 'A', 'B']
