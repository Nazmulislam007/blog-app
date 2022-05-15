import "./App.css";
import AddArticles from "./components/AddArticles";
import Articles from "./components/Articles";

function App() {
  return (
    <div className="App">
      <div className="card__container">
        <Articles />
      </div>
      <div className="card__form">
        <AddArticles />
      </div>
    </div>
  );
}

export default App;
