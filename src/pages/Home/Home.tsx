import { FC } from "react";
import { Button } from "react-bootstrap";
import "./Home.css"
import logo_vite from "../../assets/vite.svg";
import logo_react from "../../assets/react.svg";
import logo_firebase from "../../assets/firebase.svg";

const Home: FC = () => {

  const handleButtonClick = (/*ev: any*/) => {

  }

  return (
    <div className="home">
      <div className="logos">
        <img className="logo" src={ logo_vite } alt="placeholder" />
        <img className="logo" src={ logo_react } alt="placeholder" />
        <img className="logo" src={ logo_firebase } alt="placeholder" />
      </div>
      <h1>Home</h1>  
      <p>Welcome to our quiz!</p>
      <Button onClick={handleButtonClick} color="red">Hello</Button>
    </div>
  );
};
export default Home;


