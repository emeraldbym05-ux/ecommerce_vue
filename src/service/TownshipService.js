import axios from "../config";

class TownshipService {
  axios;
  constructor() {
    this.axios = axios;
  }

  getTownship() {
    let url = `/township`;
    return axios.get(url).then((request) => request.data);
  }

  addTownship(township) {
    let url = `/township`;
    return this.axios.post(url, township).then((request) => request.data);
  }

  // updateCity(city) {
  //   let url = `/city/${city.cityId}`;
  //   return this.axios.put(url, city).then((request) => request.data);
  // }

  // deleteCity(city) {
  //   let url = `/city/${city.cityId}`;
  //   return this.axios.delete(url).then((request) => request.data);
  // }
}

const service = new TownshipService();
export default service;
