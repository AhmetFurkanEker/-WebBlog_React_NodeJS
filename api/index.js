import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";

// Express uygulamasını oluştur
const app = express();

// Gelen istekleri işlemek için yerleşik JSON   kullan
app.use(express.json());
// Gelen isteklerden çerezleri çözmek için cookieParser kullan
app.use(cookieParser());

// Yüklenen dosya için hedef ve dosya adını belirlemek için yapılandırma 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Yüklenen dosyanın depolanacağı hedef klasörü belirle
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    // Yüklenen dosyanın dosya adını belirle
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  // Yüklenen dosyayı al
  const file = req.file;
  // Yüklenen dosyanın dosya adı ile bir yanıt gönder
  res.status(200).json(file.filename);
});

// Router
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Sunucuyu başlat ve 8800 portunda dinle
app.listen(8800, () => {
  console.log("Bağlantı sağlandı...");
});
