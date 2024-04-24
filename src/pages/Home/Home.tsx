import { FC, useEffect } from "react";
import "./Home.css"
import QuizFireStore from "../../firebase/firestore";
import { ButtonComponent } from "../../components/Button/Button";
import { ADD_ICON_DARK, ADD_ICON_LIGHT, QUIZ_CREATE_DARK, SAVE_ICON_LIGHT, SETTINGS_ICON_DARK, TICK_ICON_DARK } from "../../assets/Icons";
import { ButtonStyle, ButtonType } from "../../components/Button/ButtonExports";
import { v4 as uuidv4 } from 'uuid'
import { Quiz } from "../../models/Quiz";
import QuizRepository from "../../repositories/QuizRepository";
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
          icon={ADD_ICON_LIGHT}
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

