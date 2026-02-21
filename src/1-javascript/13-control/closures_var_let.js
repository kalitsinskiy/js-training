// ============================================
// TASK 3: Closures, var vs let, factory state
// ============================================
// What does this code output? Explain why.

// --- Part 1 ---
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push({ val: i, fn: () => i }); // intentional: var closure trap
}

console.log(fns[0].val, fns[0].fn()); // ?
console.log(fns[2].val, fns[2].fn()); // ?

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

console.log(p1.run()); // ?
console.log(p1.run()); // ?
console.log(p2.run()); // ?
console.log(reg);      // ?

// --- Part 3 ---
const { run } = p1;
console.log(run());      // ?
console.log(p1.stats()); // ?
console.log(p2.stats()); // ?

const allVals = fns.map(f => f.fn()).concat(reg);
console.log(allVals); // ?
