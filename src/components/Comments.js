import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineComment } from "react-icons/ai";

const Comments = ({ id }) => {
  return (
    <div className="flex items-center gap-1 justify-start">
      <span className="mb-[-5px]">{2}</span>
      <Link to={`/article/${id}`}>
        <AiOutlineComment cursor="pointer" fontSize={25} />
      </Link>
    </div>
  );
};

export default Comments;
