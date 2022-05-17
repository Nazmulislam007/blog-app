import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";

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

  const deleteArticle = async ({ id, imageUrl }) => {
    try {
      await deleteDoc(doc(db, "Articles", id));
      toast("Article delete successfully", { type: "success" });

      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.log(error);
    }
  };
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
              <button onClick={() => deleteArticle({ id, imageUrl })}>
                Delete
              </button>
            </div>
          );
        })
      )}
    </>
  );
};

export default Articles;
