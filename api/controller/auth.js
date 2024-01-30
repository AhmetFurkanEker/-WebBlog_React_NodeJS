import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Veri tabanına kullanıcı kayıt etme
export const register = (req, res) => {
  
  // Kullanıcı mevcutmu değil mi kontrolü
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  
  db.query(query, [req.body.email, req.body.username], (err, data) => {
    // Hata Kontrolü
    if (err) return res.json(err);
    // veri dönerse 409 dön
    if (data.length) return res.status(409).json("Kullanıcı zaten kayıtlı!");

    // Şifre hashleme ve kullanıcı oluşturma
    // Saltdeğeri oluşturma
    const salt = bcrypt.genSaltSync(10);
    // Password hash değeri ile encrypt edilir
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Veritabanına kayıt edilir
    const query = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    
    const values = [req.body.username, req.body.email, hash];

    db.query(query, [values], (err, data) => {
      
      if (err) return res.json(err);
      // Başarılı olursa 200 döndürme
      return res.status(200).json("Kullanıcı oluşturuldu.");
    });
  });
};

// Kullanıcı girşi Login page
export const login = (req, res) => {
  // Database kontrolü
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [req.body.username], (err, data) => {
    console.log(data)
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("Kullanıcı Bulunamadı!");

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    // Şifre kontrolü
    if (!isPasswordCorrect)
      return res.status(400).json("Yanlış Kullanıcı adı veya şifre!");

    // Giriş başarılıyse jwttoken oluşturma
    const token = jwt.sign({ id: data[0].id }, "jwtkey");

  
    const { password, ...other } = data[0];

    // Kullanıcı verilerini gönderme
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

// oturum kapatma
export const logout = (req, res) => {
  // Giriş token silinir 
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
