import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    // useState hook'u kullanarak giriş alanları için başlangıç durumunu ayarlamak
    username: "",
    email: "",
    password: "",
  });

  const [err, setError] = useState(null); 

  const navigate = useNavigate(); // react-router-dom'dan useNavigate hook'unu kullanarak yönlendirme yapmak

  const handleChange = (e) => {
    // giriş değişikliklerini yönetmek için fonksiyon
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // spread operatörü kullanarak önceki durumu mevcut giriş ile güncelle
  };

  const handleSubmit = async (e) => {
    // form gönderimini yönetmek için fonksiyon
    e.preventDefault(); 
    try {
      await axios.post("/auth/register", inputs); // axios kütüphanesini kullanarak kullanıcıyı kaydetmek için post isteği yapma
      navigate("/login"); // başarılı kayıttan sonra giriş sayfasına yönlendirme
    } catch (err) {
      
      setError(err.response.data); 
    }
  };

  return (
    <div className="auth">
      {/* kayıt formunu içeren bölüm */}
      <h1>Kayıt</h1>
      <form>
        <input
          required
          type="text"
          placeholder="Kullanıcı Adı"
          name="username"
          onChange={handleChange} // input değişikliğinde handleChange fonksiyonunu tetiklemek
        />
        <input
          required
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange} // input değişikliğinde handleChange fonksiyonunu tetiklemek
        />
        <input
          required
          type="password"
          placeholder="Şifre"
          name="password"
          onChange={handleChange} // input değişikliğinde handleChange fonksiyonunu tetiklemek
        />
        <button onClick={handleSubmit}>Kayıt Ol</button>{" "}
        {/* form gönderiminde handleSubmit fonksiyonunu tetiklemek */}
        {err && <p>{err}</p>} {/*  hata mesajını görüntülemek */}
        <span>
          Hesabınız var mı? <Link to="/login">Giriş Yap</Link>{" "}
          {/* giriş sayfasına bağlantı  */}
        </span>
      </form>
    </div>
  );
};

export default Register; // Register bileşenini dışa aktarmak
