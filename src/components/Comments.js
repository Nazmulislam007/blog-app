import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineComment } from "react-icons/ai";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Comments = ({ id }) => {
  const [comments, setComments] = useState("");

  useEffect(() => {
    const docRef = doc(db, "Articles", id);
    onSnapshot(docRef, (snapshot) => {
      setComments(snapshot.data().comments);
    });
  }, [id]);

  return (
    <div className="flex items-center gap-1 justify-start">
      <span className="mb-[-5px]">{comments?.length}</span>
      <Link to={`/article/${id}`}>
        <AiOutlineComment cursor="pointer" fontSize={25} />
      </Link>
    </div>
  );
};

export default Comments;
