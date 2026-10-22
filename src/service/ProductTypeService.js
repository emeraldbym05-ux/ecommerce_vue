import axios from "../config";

class ProductTypeService {
  axios;
  constructor() {
    this.axios = axios;
  }

  getProductType() {
    let url = `/producttype`;
    return axios.get(url).then((request) => request.data);
  }

  addProductType(producttype) {
    let url = `/producttype`;
    return this.axios.post(url, producttype).then((request) => request.data);
  }

  updateProductType(producttype) {
    let url = `/producttype/${producttype.productTypeId}`;
    return this.axios.put(url, producttype).then((request) => request.data);
  }

  deleteProductType(producttype) {
    let url = `/producttype/${producttype.productTypeId}`;
    return this.axios.delete(url).then((request) => request.data);
  }
}

const service = new ProductTypeService();
export default service;
