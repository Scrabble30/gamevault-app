import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Login from "./pages/Login.jsx";
import Reviews from "./pages/Reviews.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="games/:gameId">
                        <Route index element={<Game />} />
                        <Route path="reviews" element={<Reviews />} />
                    </Route>
                    <Route path="login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
