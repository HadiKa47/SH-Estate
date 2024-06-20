import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";

export default function HomePage() {
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
          <p>
            Welcome to SH-Estate, your premier destination for finding the
            perfect property. Whether you are searching for a cozy apartment in
            the heart of the city, a spacious family home in a tranquil suburb,
            or a luxurious retreat by the sea, SH-Estate is here to guide you
            every step of the way. Our comprehensive listings showcase a diverse
            range of real estate options, ensuring there is something to match
            every taste and budget. With user-friendly tools and expert
            guidance, navigating the journey to your dream home has never been
            easier. Start your search today and let SH-Estate help you find a
            place you will love coming home to...!
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="background-image" />
      </div>
    </div>
  );
}
