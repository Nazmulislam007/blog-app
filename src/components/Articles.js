import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Articles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const articleRef = collection(db, "Articles");
    const queryRef = query(articleRef, orderBy("createAt", "desc"));

    onSnapshot(queryRef, (snapshot) => {
      const article = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(article);
    });
  }, []);

  return (
    <>
      {articles.length === 0 ? (
        <p>No article founded</p>
      ) : (
        articles.map(({ title, id, description, createAt, imageUrl }) => {
          return (
            <div className="card" key={id}>
              <h3 className="card__title">{title}</h3>
              <p className="card__des">{description}</p>
              <img className="card__img" src={imageUrl} alt="firebase" />
              <p className="card__create">{createAt.toDate().toDateString()}</p>
            </div>
          );
        })
      )}
    </>
  );
};

export default Articles;
