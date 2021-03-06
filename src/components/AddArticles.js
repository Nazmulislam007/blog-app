import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContextProvider";

const AddArticles = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createAt: Timestamp.now().toDate(),
  });

  const { availableUser } = useAuth();

  const formSubmit = (e) => {
    e.preventDefault();
    const { title, description, image } = formData;
    if (!title || !description || !image) return alert("Fill the all data");

    const storageRef = ref(
      storage,
      `images/${new Date().getTime()}-${image.name}`
    );

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setLoading(true);
        const progressPersentage =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPersentage);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setLoading(false);
        setFormData({
          title: "",
          description: "",
          image: "",
        });
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const articleRef = collection(db, "Articles");
          addDoc(articleRef, {
            title,
            description,
            imageUrl: url,
            createAt: Timestamp.now().toDate(),
            createdBy: availableUser.displayName,
            userId: availableUser.uid,
            likes: [],
            comments: [],
          })
            .then(() => {
              toast("Article added successfull", { type: "success" });
              setProgress(0);
            })
            .catch(() => {
              toast("Failed to added Article", { type: "error" });
            });
        });
      }
    );
  };

  const handleSubmit = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSubmit = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <div className="card__form">
      <form className="form" onSubmit={formSubmit}>
        <h2>Add articles form</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          className="bg-slate-300 outline-none"
          onChange={handleSubmit}
        />
        <textarea
          name="description"
          value={formData.description}
          className="bg-slate-300 outline-none"
          onChange={handleSubmit}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="bg-slate-300 outline-none"
          onChange={handleImageSubmit}
        />
        {loading && <progress className="w-full" value={progress} max="100" />}
        <button className="bg-green-600 text-white" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddArticles;
