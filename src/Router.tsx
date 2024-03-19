import { Route, Routes } from "react-router-dom";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";


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
      title: "home"
    },
    {
      path: "about",
      element: <About />,
      title: "about"
    }
];

const Router = () => {
    const pageRoutes = pagesData.map(({ path, title, element }: RouterType) => {
        return <Route key={title} path={`/${path}`} element={element} />;
    });

    return <Routes>{pageRoutes}</Routes>;
}

export default Router;
