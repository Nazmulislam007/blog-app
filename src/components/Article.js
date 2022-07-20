import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { db, storage } from "../firebase/firebase";
import Like from "./Like";

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
        <div className="flex">
          <div className="max-w-[350px]">
            <img
              className="card__img w-[400px] h-[250px]"
              src={article.imageUrl}
              alt="firebase"
            />
            <p className="card__create">
              {article?.createAt.toDate().toDateString()}
            </p>
            <div className="w-full flex">
              <Like id={id} likes={article.likes} />
              <div className="ml-2">
                <input
                  type="text"
                  className="w-full bg-gray-200 outline-none"
                />
                <button className="w-full bg-blue-500 mt-1 hover:bg-blue-600 text-white transition-colors">
                  Comment
                </button>
              </div>
            </div>
            <div>
              <div>
                <small>author name</small>
                <p>Others Comments</p>
              </div>
              <div className="text-right">
                <small>my name</small>
                <p>my Comments</p>
              </div>
            </div>
            <button
              className="bg-red-600 text-white w-full"
              onClick={() => deleteArticle(article)}
            >
              Delete Post
            </button>
          </div>
          <div className="w-1/2 ml-3 shadow-md p-4">
            <h1 className="text-2xl">{article.title}</h1>
            <p className="text-gray-500">{article.description}</p>
          </div>
        </div>
      )}

      <button
        className="py-1 px-2 bg-red-500 text-white mt-2"
        onClick={() => navigate(-1, { replace: true })}
      >
        Back
      </button>
    </div>
  );
};

export default Article;
