import axios from "axios";

class AuthService {
  async login(user) {
    let form = {
      username: user.username,
      password: user.password,
    };
    const response = await axios.post("http://127.0.0.1:8000/api/login", form);
    if (response.data.access_token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
