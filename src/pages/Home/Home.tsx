import { FC } from "react";
import "./Home.css"
import { ButtonComponent } from "../../components/Button/Button";
import {CREATE_ICON_DARK, ENTER_ICON_LIGHT} from "../../assets/Icons";
import { ButtonStyle, ButtonType } from "../../components/Button/ButtonExports";
import { BackgroundGems } from "../../components/BackgroundGems/BackgroundGems";
import { BackgroundGemsType } from "../../components/BackgroundGems/BackgroundGemsExports";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();

  const navigateJoinQuiz = () => {
    navigate("join")
  }

  const navigateCreateQuiz = () => {
    navigate("login")
  }

  return (
    <div className="home">
      <BackgroundGems type={window.innerWidth > 480 ? BackgroundGemsType.Primary : BackgroundGemsType.PrimarySlave}/>
      <h1 className="quizableTitle">Quizable</h1>
      <div className="homeButtons">
        <ButtonComponent
          text="Join Quiz"
          icon={ENTER_ICON_LIGHT}
          type={ButtonType.Long}
          style={ButtonStyle.Primary}
          onClick={navigateJoinQuiz}
        />
        <ButtonComponent
          text="Create Quiz"
          icon={CREATE_ICON_DARK}
          type={ButtonType.Long}
          style={ButtonStyle.Secondary}
          onClick={navigateCreateQuiz}
        />
      </div>
    </div>
  );
};

export default Home;

