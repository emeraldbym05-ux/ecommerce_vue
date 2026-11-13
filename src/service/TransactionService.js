
import axios from "../config";

class TransactionService {
  axios;

  constructor() {
    this.axios = axios;
  }

  getTransactionList() {
    let url = `/transaction`;
    return axios.get(url).then((request) => request.data);
  }

  addTransaction(transaction) {
    let url = `/transaction`;
    return this.axios.post(url, transaction).then((request) => request.data);
  }

  updateTransaction(transaction) {
    let url = `/transaction/${transaction.transactionId}`;
    return this.axios.put(url, transaction).then((request) => request.data);
  }

  deleteTransaction(transaction) {
    let url = `/transaction/${transaction.transactionId}`;
    return this.axios.delete(url).then((request) => request.data);
  }
}

const service = new TransactionService();
export default service;
