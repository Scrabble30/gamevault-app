import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Login from "./pages/Login.jsx";
import Reviews from "./pages/Reviews.jsx";
import Review from "./pages/Review.jsx";
import SignUp from "./pages/Signup.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="games/:gameId">
                        <Route index element={<Game />} />
                        <Route path="reviews">
                            <Route index element={<Reviews />} />
                            <Route path="create" element={<Review />} />
                            <Route path=":reviewId/edit" element={<Review />} />
                        </Route>
                    </Route>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="*" element={<ErrorPage statusCode={404} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
