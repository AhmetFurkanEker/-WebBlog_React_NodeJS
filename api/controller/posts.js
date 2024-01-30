import { db } from "../db.js";
import jwt from "jsonwebtoken";

// veritabanından gönderileri alır
export const getPosts = (req, res) => {
  // Eğer sorgu dizesi bir kategori parametresi içeriyorsa,verilen kategoriden tüm gönderileri seç
  // Yoksa tüm gönderileri seç.
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    // Eğer bir hata varsa, 500 durum kodu ve hata mesajını gönder
    if (err) return res.status(500).send(err);

    // Aksi takdirde, 200 durum kodu ve veriyi JSON formatında gönder
    return res.status(200).json(data);
  });
};

// Veritabanından tek bir gönderiyi alır
export const getPost = (req, res) => {
  // Kullanıcılar ve gönderiler tablolarından belirli alanları seçer,
  // ve bunları gönderi yazarının kullanıcı kimliğine göre birleştirir.
  const q =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  // Veritabanı nesnesini kullanarak belirtilen ID'ye sahip gönderiyi sormak için
  // gerekli parametrelerle veritabanına sorgu yapılır.
  db.query(q, [req.params.id], (err, data) => {
    // Eğer bir hata varsa, 500 durum kodu ve hata mesajını gönder
    if (err) return res.status(500).json(err);

    // Aksi takdirde, 200 durum kodu ve veri dizisinin ilk öğesini JSON formatında gönder
    return res.status(200).json(data[0]);
  });
};

// Yeni bir gönderi ekler
export const addPost = (req, res) => {
  // Kullanıcının kimlik bilgisini çerezlerdeki bir tokenla doğrula
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Kimlik doğrulanamadı!");

  // Belirteci gizli token kullanarak doğrula
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    // Eğer bir hata varsa, token geçerli değildir
    if (err) return res.status(403).json("Belirteç geçerli değil!");

    //veritabanına yeni bir gönderi eklemek için SQL sorgusunu oluştur
    const q =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    //  SQL sorgusunu ve değerler dizisini kullanarak sorguyu çalışır
    db.query(q, [values], (err, data) => {
      // Eğer bir hata varsa, 500 durum kodu ve hata mesajını gönder
      if (err) return res.status(500).json(err);

      // Aksi takdirde, 200 durum kodu ve bir başarı mesajı gönder
      return res.json("Gönderi oluşturuldu.");
    });
  });
};

// Veritabanından bir gönderiyi siler
export const deletePost = (req, res) => {
  // Kullanıcının kimlik bilgisini çerezlerdeki bir token ile doğrula
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Kimlik doğrulanamadı");

  // Belirteci gizli token kullanarak doğrula
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    // Eğer bir hata varsa, token geçerli değil
    if (err) return res.status(403).json("Belirteç geçerli değil");

    //silinecek gönderinin ID'sini istek parametrelerinden al
    const postId = req.params.id;

    // Belirli bir ID'ye sahip gönderiyi silmek için bir SQL sorgusu oluştur
    // gönderiyle ilişkilendirilmiş kullanıcı ID'si, doğrulanmış kullanıcının ID'si ile eşleşiyorsa
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    // SQL sorgusunu postId ve userInfo.id ile parametrelerle yürüt
    db.query(q, [postId, userInfo.id], (err, data) => {
      // Eğer bir hata varsa, 403 durum kodu ve hata mesajını gönder
      if (err) return res.status(403).json("Sadece kendi gönderinizi silebilirsiniz");

      // Aksi takdirde, 200 durum kodu ve bir başarı mesajı gönder
      return res.json("Gönderi silindi");
    });
  });
};

// Bir gönderiyi güncelle
export const updatePost = (req, res) => {
  // İsteğin çerezlerinden token al
  const token = req.cookies.access_token;

  // token varlığını kontrol et, yoksa bir hata yanıtı döndür
  if (!token) return res.status(401).json("Kimlik doğrulanamadı!");

  // Belirteci "jwtkey" gizli token kullanarak doğrula. Eğer belirteç geçerli değilse, bir hata yanıtı döndür.
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Belirteç geçerli değil!");

    // İstek parametrelerinden gönderi ID'sini al
    const postId = req.params.id;

    // Yeni değerlerle gönderiyi güncellemek için SQL sorgusu
    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

    // Gönderi için yeni değerleri içeren bir dizi
    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

    // Sorguyu values ve post ID ile yürüt. Eğer bir hata varsa, bir hata yanıtı döndür. Aksi takdirde, bir başarı yanıtı döndür.
    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Gönderi güncellendi.");
    });
  });
};
