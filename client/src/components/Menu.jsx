import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Menu = ({ cat }) => {
  // posts durum değişkenini, başlangıçta boş  olarak başlat
  const [posts, setPosts] = useState([]);

  // useEffect hook'u, kategori ile ilgili gönderileri çekmek için kullan
  useEffect(() => {
    // axios kullanarak kategori ile ilgili gönderileri çekmek üzere bir fetchData adlı async fonksiyonu tanımla
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/?cat=${cat}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    // fetchData fonksiyonunu çağırarak veriyi çek; bu işlem, bileşen oluşturulduğunda veya kategori değiştiğinde gerçekleşir
    fetchData();
  }, [cat]);

  return (
    <div className="menu">
      <h1>Beğenebileceğiniz diğer gönderiler</h1>
      {/* posts dizisini  ile döngüye alarak her bir gönderiyi göster */}
      {posts.map((post) => (
        <div className="post" key={post.id}>
          {/* Gönderi kapak resmini göster */}
          <img src={`../upload/${post.img}`} alt="post cover" />
          {/* Gönderi başlığını göster */}
          <h2>{post.title}</h2>
          {/* Link bileşenini kullanarak gönderiye gitmek için bir bağlantı oluştur */}
          <Link className="link" to={`/post/${post.id}`}>
            <button>Devamını Oku...</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;
