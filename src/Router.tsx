import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import { CreateSendEmail } from "./pages/Create/CreateSendEmail/CreateSendEmail";
import { Join } from "./pages/Join/Join";
import {CreateEditor} from "./pages/Create/CreateEditor/CreateEditor.tsx";
import {CreateOverview} from "./pages/Create/CreateOverview/CreateOverview.tsx";
import {ErrorPage} from "./pages/ErrorPage/ErrorPage.tsx";
import {QuizMaster} from "./pages/Quiz/QuizMaster/QuizMaster.tsx";
import {QuizSlave} from "./pages/Quiz/QuizSlave/QuizSlave.tsx";

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
        path: "error",
        element: <ErrorPage />,
        title: "Error | Quizable"
    },
    {
      path: "overview", // needs authentication
      element: <CreateOverview/>,
      title: "Overview | Quizable"
    },
    {
      path: "overview/editor", // needs authentication
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
        path: "quiz", // needs authentication
        element: <QuizMaster />,
        title: "Hosting Quiz | Quizable"
    },
    {
        path: "quiz/player",
        element: <QuizSlave />,
        title: "Playing Quiz | Quizable"
    },
];

const Router = () => {
    const pageRoutes = pagesData.map(({ path, title, element }: RouterType) => {
        return <Route key={title} path={`/${path}`} element={element} />;
    });

    return <Routes>{pageRoutes}</Routes>;
}

export default Router;
