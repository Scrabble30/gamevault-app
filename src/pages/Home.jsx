import { useState, useEffect } from "react";
import gamevaultApiFacade from "../services/gamevaultApiFacade";

import GameScroller from "../components/GameScroller";
import styled from "styled-components";

const HomeContainer = styled.div`
    padding: 1rem 0;
`;

const GameScrollersContainer = styled.ul`
    display: flex;
    padding: 0;
    margin: 0;

    flex-direction: column;
    gap: 2.5rem;

    list-style-type: none;
`;

const Home = () => {
    const [topNewGames, setTopNewGames] = useState([]);
    const [topMetacriticGames, setTopMetacriticGames] = useState([]);
    const [topRatedGames, setTopRatedGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            let fetchedGames = await gamevaultApiFacade.getAllGames();
            fetchedGames = fetchedGames.map((game) => ({
                ...game,
                ["released"]: new Date(game.released),
            }));

            let gamesByReleased = fetchedGames.sort(
                (a, b) => b.released - a.released
            );

            setTopNewGames(
                gamesByReleased.slice(0, Math.min(10, gamesByReleased.length))
            );

            let gamesByMetacritic = fetchedGames.sort(
                (a, b) => b.metacritic - a.metacritic
            );

            setTopMetacriticGames(
                gamesByMetacritic.slice(
                    0,
                    Math.min(10, gamesByMetacritic.length)
                )
            );

            let gamesByRating = fetchedGames.sort(
                (a, b) => b.rating - a.rating
            );

            setTopRatedGames(
                gamesByRating.slice(0, Math.min(10, gamesByRating.length))
            );
        };

        fetchGames();
    }, []);

    return (
        <HomeContainer>
            <GameScrollersContainer>
                <GameScroller title={"New Games"} games={topNewGames} />
                <GameScroller
                    title={"Top Metacritic Games"}
                    games={topMetacriticGames}
                />
                <GameScroller title={"Top Rated Games"} games={topRatedGames} />
            </GameScrollersContainer>
        </HomeContainer>
    );
};

export default Home;
