import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContextProvider";
import { AiFillDelete } from "react-icons/ai";

import { db, storage } from "../firebase/firebase";
import Like from "./Like";

const Article = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const { availableUser } = useAuth();
  const [commentValue, setCommentValue] = useState("");
  const [getComments, setGetComments] = useState([]);

  useEffect(() => {
    const articleRef = doc(db, "Articles", id);

    onSnapshot(articleRef, (snapshot) => {
      setArticle({ ...snapshot.data(), id: snapshot.id });
      setGetComments(snapshot.data().comments);
    });
  }, [id]);

  const deleteArticle = async (article) => {
    if (window.confirm("Are you going to delete this blog?")) {
      try {
        navigate("/", { replace: true });
        await deleteDoc(doc(db, "Articles", article.id));
        const storageRef = ref(storage, article.imageUrl);
        await deleteObject(storageRef);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const commentsRef = doc(db, "Articles", id);
  const handleSubmit = (e) => {
    e.preventDefault();
    updateDoc(commentsRef, {
      comments: arrayUnion({
        user: availableUser.uid,
        userName: availableUser.displayName,
        comment: commentValue,
        createAt: new Date(),
        commentId: Date.now(),
      }),
    })
      .then(() => setCommentValue(""))
      .catch((err) => console.log(err));
  };

  const deleteComments = (id) => {
    updateDoc(commentsRef, {
      comments: arrayRemove(id),
    })
      .then(() => alert("success"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="max-w-7xl mx-auto">
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
                  onChange={(e) => setCommentValue(e.target.value)}
                  value={commentValue}
                />
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 mt-1 hover:bg-blue-600 text-white transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
            <div>
              {getComments.map(
                ({ user, userName, comment, createAt, commentId }) =>
                  user !== availableUser?.uid && (
                    <div key={commentId}>
                      <small className="text-green-800">{userName}</small>
                      <p>{comment}</p>
                      <p>{createAt.toDate().toDateString()}</p>
                    </div>
                  )
              )}
              {getComments.map(
                ({ user, userName, comment, createAt, commentId }) =>
                  user === availableUser?.uid && (
                    <div key={commentId} className="text-right">
                      <small className="flex items-center justify-end text-green-800">
                        {userName}
                        <span className="ml-1">
                          <AiFillDelete
                            cursor="pointer"
                            onClick={() =>
                              deleteComments({
                                user,
                                userName,
                                comment,
                                createAt,
                                commentId,
                              })
                            }
                          />
                        </span>
                      </small>
                      <p>{comment}</p>
                      <p>{createAt.toDate().toDateString()}</p>
                    </div>
                  )
              )}
            </div>
            {availableUser?.uid === article.userId && (
              <button
                className="bg-red-600 text-white w-full"
                onClick={() => deleteArticle(article)}
              >
                Delete Post
              </button>
            )}
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
