import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="/games/:gameId" element={<Game />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
