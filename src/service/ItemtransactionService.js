
import axios from "../config";

class ItemtransactionService {
  axios;

  constructor() {
    this.axios = axios;
  }

  getItemtransaction() {
    let url = `/itemtransaction`;
    return this.axios.get(url).then((request) => request.data);
  }

  addItemtransaction(itemtransaction) {
    let url = `/itemtransaction`;
    return this.axios.post(url, itemtransaction).then((request) => request.data);
  }

  updateItemtransaction(itemtransaction) {
    let url = `/itemtransaction/${itemtransaction.itemTransactionId}`;
    return this.axios.put(url, itemtransaction).then((request) => request.data);
  }

  deleteItemtransaction(itemTransactionId) {
    let url = `/itemtransaction/${itemTransactionId}`;
    return this.axios.delete(url).then((request) => request.data);
  }
}

export default new ItemtransactionService();
