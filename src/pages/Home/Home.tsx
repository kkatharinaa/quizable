import { FC, useEffect } from "react";
import "./Home.css"
import QuizFireStore from "../../firebase/firestore";
import { ButtonComponent } from "../../components/Button/Button";
import { SAVE_ICON_LIGHT } from "../../assets/Icons";
import { ButtonStyle, ButtonType } from "../../components/Button/ButtonExports";
import { v4 as uuidv4 } from 'uuid'
import { Quiz } from "../../models/Quiz";
import QuizRepository from "../../repositories/QuizRepository";

const Home: FC = () => {

  // const [quiz, setQuiz] = useState([]);
  const fetchFireStore = async () => {
    console.log("Get firestore stuff")
    const firestoreData = await QuizFireStore.getUserDocument("gclVWPbq3lDp2SE2VW3L")
    console.log(firestoreData)
  }

  useEffect(() => {
    fetchFireStore()
  }, [])

  const joinQuiz = () => {

  }

  const createNewQuiz = () => {
    // TODO: go to create new quiz 

    // now we will go straight the quiz overview.
    const newQuiz: Quiz = Quiz.default;
    QuizRepository.add(newQuiz);
  }

  return (
    <div className="home">
      <h1>Quizable</h1>
      <ButtonComponent
        text="Join Quiz"
        className="button_spacing"
        icon={SAVE_ICON_LIGHT}
        type={ButtonType.Long}
        style={ButtonStyle.Primary}
        onClick={joinQuiz}
      />
      <ButtonComponent
        text="Create Quiz"
        className="button_spacing"
        icon={SAVE_ICON_LIGHT}
        type={ButtonType.Long}
        style={ButtonStyle.Accent}
        onClick={createNewQuiz}
      />
    </div>
  );
};

export default Home;

