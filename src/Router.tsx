import { Route, Routes } from "react-router-dom";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import { CreateSendEmail } from "./pages/Create/CreateSendEmail/CreateSendEmail";
import { Join } from "./pages/Join/Join";
import { QuizLobby } from "./pages/Quiz/QuizLobby/QuizLobby";
import QuizResult from "./pages/Quiz/QuizResult/QuizResult";
import { QuizSession } from "./pages/Quiz/QuizSession/QuizSession";


export interface RouterType {
    title: string;
    path: string;
    element: JSX.Element;
}

// This is where we add the routes to our project
const pagesData: RouterType[] = [
    {
      path: "",
      element: <Home />,
      title: "Home | Quizable"
    },
    {
      path: "about",
      element: <About />,
      title: "About | Quizable"
    },
    {
      path: "create/editor",
      element: <CreateSendEmail />,
      title: "Create / Edit | Quizable"
    },
    {
      path: "create/email",
      element: <CreateSendEmail />,
      title: "Create / Edit | Quizable"
    },
    {
      path: "join",
      element: <Join />,
      title: "Join Quiz | Quizable"
    },
    {
      path: "quiz/lobby",
      element: <QuizLobby />,
      title: "Quiz Lobby | Quizable"
    },
    {
      path: "quiz/result",
      element: <QuizResult />,
      title: "Quiz Result | Quizable"
    },
    {
      path: "quiz/session",
      element: <QuizSession />,
      title: "Quiz Session | Quizable"
    },
];

const Router = () => {
    const pageRoutes = pagesData.map(({ path, title, element }: RouterType) => {
        return <Route key={title} path={`/${path}`} element={element} />;
    });

    return <Routes>{pageRoutes}</Routes>;
}

export default Router;
