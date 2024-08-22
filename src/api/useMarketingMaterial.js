import axios from 'axios';
import { originAPi } from '../lib/store';

export const marketingProducts = async () => {
  const res = await axios.post(`${originAPi}/marketing-material/products`);
  console.log(res);
  return res.data; // Return the fetched data
};