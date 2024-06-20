import Navbar from "./components/navbar/Navbar";
import HomePage from "./routes/homePage/homePage";

import "./layout.scss";
export default function App() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <HomePage />
      </div>
    </div>
  );
}
