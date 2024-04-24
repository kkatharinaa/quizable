import { FC, useEffect } from "react";
import "./Home.css"
import { ButtonComponent } from "../../components/Button/Button";
import { QUIZ_CREATE_DARK } from "../../assets/Icons";
import { ButtonStyle, ButtonType } from "../../components/Button/ButtonExports";
import { BackgroundGems } from "../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../components/BackgroundGems/BackgroundGemsExports";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();

  // const [quiz, setQuiz] = useState([]);
  const fetchFireStore = async () => {
    console.log("Get firestore stuff")
  }

  useEffect(() => {
    fetchFireStore()
  }, [])

  const navigateJoinQuiz = () => {
    navigate("join")
  }

  const navigateCreateQuiz = () => {
    navigate("overview")
  }

  return (
    <div className="home">
      <BackgroundGems type={BackgroundGemsType.Primary}/>
      <h1 className="quizableTitle">Quizable</h1>
      <div className="homeButtons">
        <ButtonComponent
          text="Join Quiz"
          icon={null}
          type={ButtonType.Long}
          style={ButtonStyle.Primary}
          onClick={navigateJoinQuiz}
        />
        <ButtonComponent
          text="Create Quiz"
          icon={QUIZ_CREATE_DARK}
          type={ButtonType.Long}
          style={ButtonStyle.Secondary}
          onClick={navigateCreateQuiz}
        />
      </div>
    </div>
  );
};

export default Home;

