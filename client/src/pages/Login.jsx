import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Login = () => {
  // Giriş değişkeni useState
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setError] = useState(null);

  // Sayfa Yönlendirme
  const navigate = useNavigate();

  // Oturum açma 
  const { login } = useContext(AuthContext);

  // Kullanıcı verilerini değişkenlere atama
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Kullanıcı bilgilerini yollama
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // "/auth/login" 
      await login(inputs);
      navigate("/");
    } catch (err) {
      
      setError(err.response.data);
    }
  };

  
  return (
    <div className="auth">
      <h1>Giriş</h1>
      <form>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          name="username"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Şifre"
          name="password"
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Giriş</button>
        {err && <p>{err}</p>}
        <span>
          Üye değil misin ? <Link to="/register">Kayıt</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
