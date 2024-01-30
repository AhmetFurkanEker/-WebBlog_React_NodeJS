import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Yeni bir AuthContext adlı bir değişken oluştur
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // currentUser adlı bir durum değişkenini başlat ve onu localStorage'deki kullanıcı nesnesine veya null olarak ayarla (eğer yoksa)
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // bu fonksiyon, verilen giriş bilgileriyle /auth/login uç noktasına POST isteği yapar ve currentUser durum değişkenini yanıt verisiyle eşler
  const login = async (inputs) => {
    const res = await axios.post("/auth/login", inputs);
    setCurrentUser(res.data);
  };

  // logout adlı bir fonksiyon tanımla; bu fonksiyon, /auth/logout uç noktasına POST isteği yapar ve currentUser durum değişkenini null olarak ayarlar
  const logout = async () => {
    await axios.post("/auth/logout");
    setCurrentUser(null);
  };

  // currentUser durum değişkenini her değiştiğinde localStorage'a depola
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  // AuthContext.Provider bileşenini döndür; değer olarak currentUser, login ve logout fonksiyonlarını içeren bir objeyi, children'ı ise çocuk bileşenleri olarak alır
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
