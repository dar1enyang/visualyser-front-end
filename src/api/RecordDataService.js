import axios from "axios";
import { API_URL } from "../Constants";

class RecordDataService {
  retrieveAllRecords() {
    return axios.get(`${API_URL}/records`);
  }
  retrieveRecordsSurvived(isSurvived) {
    return axios.get(`${API_URL}/records/survived/${isSurvived}`);
  }
  uploadRecord(data) {
    axios.post(`${API_URL}/records`, JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

export default new RecordDataService();
