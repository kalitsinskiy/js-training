const api = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('data');
    }, Math.random() * (20000 - 1000) + 1000);
  });
};

const REQUEST_TIMEOUT = 5000;

/* some logic */

const response = await api();

console.log('response', response);

/* another logic */
