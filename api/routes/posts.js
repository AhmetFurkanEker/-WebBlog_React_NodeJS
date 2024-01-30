import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controller/posts.js";


const router = express.Router();


router.get("/", getPosts); // Tüm gönderileri al
router.get("/:id", getPost); // Belirli bir gönderiyi ID'ye göre al
router.post("/", addPost); // Yeni bir gönderi ekleyin
router.delete("/:id", deletePost); // ID'ye göre bir gönderiyi sil
router.put("/:id", updatePost); // ID'ye göre bir gönderiyi güncelle

export default router;
