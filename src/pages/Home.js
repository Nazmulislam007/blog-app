import React from "react";
import AddArticles from "../components/AddArticles";
import Articles from "../components/Articles";

const Home = () => {
  return (
    <div className="App">
      <Articles />
      <AddArticles />
    </div>
  );
};

export default Home;
