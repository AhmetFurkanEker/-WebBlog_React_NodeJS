import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Home = () => {
  // posts adlı bir durum değişkenini başlat ve başlangıçta boş bir dizi olarak ayarla
  const [posts, setPosts] = useState([]);

  // useLocation hook'unu kullanarak mevcut URL sorgu dizesini (varsa) al
  const cat = useLocation().search;

  // cat değişkeni değiştiğinde çalışacak bir etki tanımla
  useEffect(() => {
    // fetchData adlı bir asenkron fonksiyonu tanımla
    const fetchData = async () => {
      try {
        // cat değişkenine bağlı olarak gönderi verilerini almak için sunucuya HTTP GET isteği yap
        const res = await axios.get(`/posts${cat}`);
        // Alınan veri ile posts durum değişkenini güncelle
        setPosts(res.data);
      } catch (err) {
        // İstek sırasında herhangi bir hata oluşursa logla
        console.log(err);
      }
    };
    // fetchData fonksiyonunu çağır
    fetchData();
  }, [cat]); // Bu etkinin sadece cat değişkeni değiştiğinde çalışması gerektiğini belirt

  // getText adlı bir yardımcı fonksiyon tanımla; bu fonksiyon, bir HTML dizesini alır ve metin içeriğini döndürür
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  // Home bileşenini render et
  return (
    <div className="home">
      <div className="posts">
        {/* posts  değişkeni  Post  oluştur */}
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="post-img">
              {/* Gönderi resmini render et */}
              <img src={`../upload/${post.img}`} alt="post cover" />
            </div>
            <div className="content">
              {/* Gönderi sayfasına yönlendiren bir bağlantıyı render et */}
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              {/* Gönderi açıklamasını render et */}
              <p>{getText(post.desc)}</p>
              {/* Daha fazla okuma için bir düğmeyi render et */}
              <Link className="link" to={`/post/${post.id}`}>
                <button>Daha fazla</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
