import { counter } from './util';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default async function () {
  console.log('bla bla bla');
  console.log(counter);
  console.log((global as any).testVariable);
  await delay(3000);
  // Delete all the tables
}
