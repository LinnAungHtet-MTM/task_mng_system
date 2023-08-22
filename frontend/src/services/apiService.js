import { apiClient } from "./apiClient";

class ApiService {
  endPoint;
  constructor(apiEndPoint) {
    this.endPoint = apiEndPoint;
  }

  getAll() {
    return apiClient.get(this.endPoint + "/list");
  }

  edit(id, payload) {
    return apiClient.put(this.endPoint + "/edit/" + id, payload);
  }

  getById(id) {
    return apiClient.get(this.endPoint + "/" + id);
  }

  add(payload) {
    return apiClient.post(this.endPoint + "/add", payload);
  }

  delete(id) {
    return apiClient.delete(this.endPoint + "/delete/" + id);
  }
}

export function create(endPoint) {
  return new ApiService(endPoint);
}
