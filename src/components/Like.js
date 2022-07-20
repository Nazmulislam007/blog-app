import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useAuth } from "../Context/AuthContextProvider";
import { db } from "../firebase/firebase";

const Like = ({ id, likes }) => {
  const { availableUser } = useAuth();
  const articleRef = doc(db, "Articles", id);

  const handleLikes = () => {
    if (likes?.includes(availableUser.uid)) {
      updateDoc(articleRef, { likes: arrayRemove(availableUser.uid) })
        .then(() => console.log("unliked"))
        .catch((err) => console.log(err));
    } else {
      updateDoc(articleRef, { likes: arrayUnion(availableUser.uid) })
        .then(() => console.log("liked"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="flex items-center gap-1 justify-start">
      <span className="mb-[-7px]">{likes?.length}</span>
      {likes?.includes(availableUser?.uid) ? (
        <AiFillLike onClick={handleLikes} cursor="pointer" fontSize={25} />
      ) : (
        <AiOutlineLike onClick={handleLikes} cursor="pointer" fontSize={25} />
      )}
    </div>
  );
};

export default Like;
