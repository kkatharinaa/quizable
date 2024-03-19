import { FC } from "react";
import { Button } from "react-bootstrap";
import "./Home.css"

const Home: FC = () => {

  const handleButtonClick = (/*ev: any*/) => {

  }

  return (
    <div className="home">
      <h1>Home</h1>  
      <p>Welcome to our quiz!</p>
      <Button onClick={handleButtonClick} color="red">Hello</Button>
    </div>
  );
};
export default Home;


