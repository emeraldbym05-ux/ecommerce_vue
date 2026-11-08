import axios from "../config";

class PurchaseService {
  axios;

  constructor() {
    this.axios = axios;
  }

  getPurchaseList() {
    let url = `/purchase`;
    return axios.get(url).then((request) => request.data);
  }

  addPurchase(purchase) {
    let url = `/purchase`;
    return this.axios.post(url, purchase).then((request) => request.data);
  }

  updatePurchase(purchase) {
    let url = `/purchase/${purchase.purchaseId}`;
    return this.axios.put(url, purchase).then((request) => request.data);
  }

  deletePurchase(purchase) {
    let url = `/purchase/${purchase.purchaseId}`;
    return this.axios.delete(url).then((request) => request.data);
  }
}

const service = new PurchaseService();
export default service;