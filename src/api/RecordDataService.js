import axios from "axios";
import { API_URL } from "../config/Constants";

class RecordDataService {
  retrieveAllRecords() {
    return axios.get(`${API_URL}/records`);
  }

  uploadRecord(data) {
    axios.post(`${API_URL}/records`, JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

export default new RecordDataService();
