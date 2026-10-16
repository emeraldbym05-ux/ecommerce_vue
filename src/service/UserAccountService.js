import axios from "../config";

class UserAccountService {
  axios;
  constructor() {
    this.axios = axios;
  }

  getUseraccount(type) {
    let url = `/useraccount`;
    return axios.get(url, { params: { type } }).then((request) => request.data);
  }

  addUserAccount(user) {
    let url = `/useraccount`;
    return this.axios.post(url, user).then((request) => request.data);
  }

  // updateUserAccount(userAccount) {
  //   let url = `/useraccount/${userAccount.userAccountId}`;
  //   return this.axios.put(url, userAccount).then((request) => request.data);
  // }

  // deleteUserAccount(userAccount) {
  //   let url = `/useraccount/${userAccount.userAccountId}`;
  //   return this.axios.delete(url).then((request) => request.data);
  // }
}

const service = new UserAccountService();
export default service;
