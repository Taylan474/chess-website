import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./pages/Game/game";
import Home from "./pages/Home/home";
import { GameProvider } from "./context/chessGameContext";
import "./App.css";

function App() {
    return (
        <Router>
            <GameProvider>
                <Routes>
                    <Route path="/" exact element={<Home />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </GameProvider>
        </Router>
    );
}

export default App;