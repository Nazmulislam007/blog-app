import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

const AddArticles = () => {
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createAt: Timestamp.now().toDate(),
  });

  const formSubmit = (e) => {
    e.preventDefault();
    const { title, description, image } = formData;
    if (!title || !description || !image) return alert("Fill the all data");

    const storageRef = ref(
      storage,
      `images/${new Date().getTime()}-${image.name}`
    );

    uploadBytesResumable(storageRef, image).on(
      "state_changed",
      (snapshot) => {
        const progressPersentage =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPersentage);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          image: "",
        });
        getDownloadURL(
          uploadBytesResumable(storageRef, image).snapshot.ref
        ).then((url) => {
          const articleRef = collection(db, "Articles");
          addDoc(articleRef, {
            title,
            description,
            imageUrl: url,
            createAt: Timestamp.now().toDate(),
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
    <form onSubmit={formSubmit}>
      <h2>Add articles form</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleSubmit}
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleSubmit}
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageSubmit}
      />
      <progress value={progress} max="100" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddArticles;
