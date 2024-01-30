import React, { useContext, useEffect, useState } from "react";
import EditImage from "../images/edit.png";
import DeleteImage from "../images/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";

const Single = () => {
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="post cover" />
        <div className="user">
          {post.userImg && <img src={post.userImg} alt="user" />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={EditImage} alt="edit" />
              </Link>
              <img onClick={handleDelete} src={DeleteImage} alt="delete" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <i>"{getText(post.desc)}"</i>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula
          ipsum. Enim lobortis scelerisque fermentum dui faucibus in ornare
          quam. Viverra justo nec ultrices dui sapien. Aliquam nulla facilisi
          cras fermentum odio eu feugiat pretium. Suscipit adipiscing bibendum
          est ultricies integer quis auctor elit. Eu volutpat odio facilisis
          mauris. Consectetur adipiscing elit pellentesque habitant morbi
          tristique. Tristique senectus et netus et malesuada fames. Convallis a
          cras semper auctor neque. Sed felis eget velit aliquet sagittis id
          consectetur purus ut. Eu feugiat pretium nibh ipsum consequat nisl vel
          pretium lectus. Ac odio tempor orci dapibus. Velit scelerisque in
          dictum non consectetur a. Nibh tellus molestie nunc non blandit massa
          enim nec. Rutrum quisque non tellus orci ac auctor augue mauris.
        </p>
        <p>
          Diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Eu
          facilisis sed odio morbi quis commodo. Scelerisque mauris pellentesque
          pulvinar pellentesque. Tortor aliquam nulla facilisi cras fermentum.
          Accumsan lacus vel facilisis volutpat est. Nam libero justo laoreet
          sit. Nunc faucibus a pellentesque sit amet porttitor eget dolor. Cum
          sociis natoque penatibus et magnis. Nunc scelerisque viverra mauris in
          aliquam sem. Id porta nibh venenatis cras sed. Ac tortor vitae purus
          faucibus ornare suspendisse. Montes nascetur ridiculus mus mauris
          vitae ultricies leo integer malesuada. Turpis tincidunt id aliquet
          risus. Sed adipiscing diam donec adipiscing tristique risus nec.
          Tempor id eu nisl nunc mi ipsum faucibus. Iaculis urna id volutpat
          lacus laoreet non. Neque volutpat ac tincidunt vitae semper quis
          lectus. Vitae ultricies leo integer malesuada nunc vel risus commodo.
          Cras sed felis eget velit aliquet sagittis id consectetur. Eros donec
          ac odio tempor orci dapibus ultrices in iaculis.
        </p>
        <p>
          Ut eu sem integer vitae. Aliquam vestibulum morbi blandit cursus risus
          at. Convallis aenean et tortor at risus viverra adipiscing at. Sit
          amet dictum sit amet justo donec enim. Nulla aliquet porttitor lacus
          luctus accumsan tortor. Ultrices mi tempus imperdiet nulla malesuada
          pellentesque elit eget gravida. Dui sapien eget mi proin sed. Urna
          nunc id cursus metus aliquam eleifend mi in. Euismod quis viverra nibh
          cras pulvinar mattis. Consequat nisl vel pretium lectus quam id leo in
          vitae. Turpis egestas integer eget aliquet nibh praesent tristique
          magna. Dui accumsan sit amet nulla facilisi. Risus ultricies tristique
          nulla aliquet enim tortor at auctor.
        </p>
        <p>
          Morbi tincidunt ornare massa eget egestas purus viverra accumsan in.
          Eget nunc lobortis mattis aliquam. Quisque non tellus orci ac auctor.
          Gravida quis blandit turpis cursus in hac habitasse platea dictumst.
          Id neque aliquam vestibulum morbi blandit cursus risus. Orci porta non
          pulvinar neque laoreet suspendisse interdum. In nibh mauris cursus
          mattis molestie a. Phasellus faucibus scelerisque eleifend donec
          pretium vulputate. Dis parturient montes nascetur ridiculus mus mauris
          vitae ultricies. Elit scelerisque mauris pellentesque pulvinar. Enim
          praesent elementum facilisis leo vel fringilla est ullamcorper eget.
        </p>
      </div>
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
