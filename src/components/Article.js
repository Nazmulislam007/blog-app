import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../firebase/firebase";

const Article = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const articleRef = doc(db, "Articles", id);

    onSnapshot(articleRef, (snapshot) => {
      setArticle({ ...snapshot.data(), id: snapshot.id });
    });
  }, [id]);

  const deleteArticle = async (article) => {
    try {
      navigate("/", { replace: true });
      await deleteDoc(doc(db, "Articles", article.id));
      const storageRef = ref(storage, article.imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="article__container">
      {article && (
        <div className="card">
          <h3 className="card__title">{article.title}</h3>
          <p className="card__des">{article.description}</p>
          <img
            className="card__img"
            width="400"
            height="250"
            src={article.imageUrl}
            alt="firebase"
          />
          <p className="card__create">
            {article?.createAt.toDate().toDateString()}
          </p>
          <button onClick={() => deleteArticle(article)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Article;
