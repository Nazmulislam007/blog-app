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
import { Link } from "react-router-dom";
import Like from "./Like";
import Comments from "./Comments";
import { useAuth } from "../Context/AuthContextProvider";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const { availableUser } = useAuth();

  useEffect(() => {
    const articleRef = collection(db, "Articles");
    const queryRef = query(articleRef, orderBy("createAt", "asc"));

    onSnapshot(queryRef, (snapshot) => {
      const article = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(article);
    });
  }, []);

  const deleteArticle = async ({ id, imageUrl }) => {
    if (window.confirm("sure?")) {
      try {
        await deleteDoc(doc(db, "Articles", id));
        toast("Article delete successfully", { type: "success" });
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="card__container">
      {articles.length === 0 ? (
        <p>No article founded</p>
      ) : (
        articles.map(
          ({ title, id, userId, likes, description, createAt, imageUrl }) => {
            return (
              <div className="card" key={id}>
                <Link to={`/article/${id}`}>
                  <h3 className="card__title">{title}</h3>
                  <p className="card__des">{description}</p>
                  <img
                    className="card__img w-full h-[250px]"
                    src={imageUrl}
                    alt="firebase"
                  />
                  <p className="card__create">
                    {createAt.toDate().toDateString()}
                  </p>
                </Link>
                <div className="flex items-center justify-between px-1">
                  <Like id={id} likes={likes} />
                  <Comments id={id} />
                </div>
                {availableUser?.uid === userId && (
                  <button
                    className="py-1 px-2 bg-red-500 text-white "
                    onClick={() => deleteArticle({ id, imageUrl })}
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          }
        )
      )}
    </div>
  );
};

export default Articles;
