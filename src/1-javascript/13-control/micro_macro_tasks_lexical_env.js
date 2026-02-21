setTimeout(() => {
  console.log(a);
});

new Promise((resolve, reject) => {
  if (a == null) {
    reject(4);
  }
  resolve(a);
})
  .then(console.log)
  .catch(console.error)
  .finally(console.log)
  .then(console.log);

for (var a = 0; a <= 2; a++) {
  console.log(a);
}
