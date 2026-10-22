import axios from "../config";

class ProductService {
  axios;
  constructor() {
    this.axios = axios;
  }

  getProductList() {
    let url = `/product`;
    return axios.get(url).then((request) => request.data);
  }

  // addProduct(product) {
  //   let url = `/product`;
  //   return this.axios.post(url, product).then((request) => request.data);
  // }

  // updateProduct(product) {
  //   let url = `/product/${product.productId}`;
  //   return this.axios.put(url, product).then((request) => request.data);
  // }

  // deleteProduct(product) {
  //   let url = `/product/${product.productId}`;
  //   return this.axios.delete(url).then((request) => request.data);
  // }
}

const service = new ProductService();
export default service;
