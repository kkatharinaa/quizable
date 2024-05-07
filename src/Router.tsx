import { Route, Routes } from "react-router-dom";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import { CreateSendEmail } from "./pages/Create/CreateSendEmail/CreateSendEmail";
import { Join } from "./pages/Join/Join";
import {CreateEditor} from "./pages/Create/CreateEditor/CreateEditor.tsx";
import {CreateOverview} from "./pages/Create/CreateOverview/CreateOverview.tsx";
import {ErrorPage} from "./pages/ErrorPage/ErrorPage.tsx";
import {QuizMaster} from "./pages/Quiz/QuizMaster/QuizMaster.tsx";
import {QuizSlave} from "./pages/Quiz/QuizSlave/QuizSlave.tsx";

// TODO: only make master routes accessible if you are logged in

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
        path: "error",
        element: <ErrorPage />,
        title: "Error | Quizable"
    },
    {
      path: "overview",
      element: <CreateOverview/>,
      title: "Overview | Quizable"
    },
    {
      path: "overview/editor",
      element: <CreateEditor/>,
      title: "Edit | Quizable"
    },
    {
      path: "login",
      element: <CreateSendEmail />,
      title: "Login | Quizable"
    },
    {
      path: "join",
      element: <Join />,
      title: "Join Quiz | Quizable"
    },
    {
        path: "quiz",
        element: <QuizMaster />,
        title: "Quiz | Quizable"
    },
    {
        path: "quiz/player",
        element: <QuizSlave />,
        title: "Quiz | Quizable"
    },
];

const Router = () => {
    const pageRoutes = pagesData.map(({ path, title, element }: RouterType) => {
        return <Route key={title} path={`/${path}`} element={element} />;
    });

    return <Routes>{pageRoutes}</Routes>;
}

export default Router;
