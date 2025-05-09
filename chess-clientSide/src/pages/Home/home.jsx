// home/index.jsx

import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/layout";
import "./home-style.css";  // Import CSS styles for the home component
import Button from "../../components/button/button";
import { useNavigate, useLocation } from "react-router-dom";
import qs from "query-string";

const Form = () => {
    const [nameCreate, setNameCreate] = useState("");  // State for the name when creating a game
    const [nameJoin, setNameJoin] = useState("");      // State for the name when joining a game
    const [gameID, setGameID] = useState("");          // State for the game ID when creating a game
    const [opponentGameID, setOpponentGameID] = useState("");  // State for the opponents game ID when joining a game
    const navigate = useNavigate();                    // Navigation function from react-router-dom
    const location = useLocation();                    // Location hook to access the current URL location
    const { id: inviteID } = qs.parse(location.search);  // Parse the invite ID from the query string

    useEffect(() => {
        if (inviteID) return setGameID(inviteID);      // Set gameID if inviteID exists in the query string
        const id = Math.random().toString().replace("0.", "");  // Generate a random game ID if no inviteID
        setGameID(id);
    }, [inviteID]);

    const handleSubmitCreate = (event) => {
        event.preventDefault();
        if (!(nameCreate && gameID)) {                  // Validate name and gameID before navigation
            return;
        }
        navigate(`/game?name=${nameCreate}&id=${gameID}`);  // Navigate to game page with name and gameID as query parameters
    };

    const handleSubmitJoin = (event) => {
        event.preventDefault();
        if (!(nameJoin && opponentGameID)) {            // Validate name and opponentGameID before navigation
            return;
        }
        navigate(`/game?name=${nameJoin}&id=${opponentGameID}`);  // Navigate to game page with name and opponents game ID as query parameters
    };

    return (
        <div className="containerHome">
            <div className="createGame">
                <div className="createGameContent">
                    <h2>Be the one to create a game room</h2>
                    <form onSubmit={handleSubmitCreate}>
                        <input
                            type="text"
                            className="inputNameCreate"
                            value={nameCreate}
                            onChange={({ target }) => setNameCreate(target.value)}
                            placeholder="Enter Name"
                        />
                        <div className="gameId">Game ID: {gameID} </div>
                        <hr />
                        <Button type="submit">Create</Button>
                    </form>
                </div>
            </div>

            <div className="joinGame">
                <h2>Join a friend's game room</h2>
                <form onSubmit={handleSubmitJoin}>
                    <input
                        type="text"
                        className="NameJoin"
                        value={nameJoin}
                        onChange={({ target }) => setNameJoin(target.value)}
                        placeholder="Enter Name"
                    />
                    <input
                        type="text"
                        className="inputUrl"
                        value={opponentGameID}
                        onChange={({ target }) => setOpponentGameID(target.value)}
                        placeholder="Enter Game ID"
                    />
                    <Button type="submit">Join Game</Button>
                </form>
            </div>
        </div>
    );
};

const Home = () => {
    return <Layout Content={Form}/>;  // Render the layout with the Form component as content
};

export default Home;
