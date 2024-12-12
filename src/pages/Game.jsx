import { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";

import gamevaultApiFacade from "../services/gamevaultApiFacade";
import ReadMore from "../components/ReadMore";

const GameContainer = styled.div`
    padding: 1rem;
`;

const GameTitle = styled.h1`
    font-size: 1.6rem;
    margin: 0;
`;

const GameBannerContainer = styled.div`
    margin: 0.8rem 0 0 0;
    max-width: 600px;
`;

const GameBanner = styled.img`
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
`;

const GameBannerInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0.2rem 0 0 0;
    gap: 0.5rem;
`;

const GameBannerBasicInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const GameReleased = styled.p`
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
`;

const GameRating = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.2rem;
`;

const Star = styled.img`
    height: 0.8rem;
`;

const RatingCount = styled.span`
    color: rgba(255, 255, 255, 0.65);
`;

const GameGenreListContainer = styled.ul`
    list-style-type: none;
    display: flex;
    padding: 0;
    margin: 0;
    gap: 0.5rem;
`;

const GameGenre = styled.li`
    background-color: grey;
    padding: 0.1rem 0.4rem;
`;

const GameDetails = styled.div`
    margin: 1rem 0 0 0;
`;

const MetascoreValue = styled.div`
    width: 1.8rem;
    height: 1.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.25rem;
    border: solid 2px
        ${(props) =>
            props.metascore >= 75
                ? "#66cc33"
                : props.metascore >= 50
                ? "#ffcc33"
                : "#ff0000"};
    color: ${(props) =>
        props.metascore >= 75
            ? "#66cc33"
            : props.metascore >= 50
            ? "#ffcc33"
            : "#ff0000"};
    font-weight: bold;
`;

const Game = () => {
    const browserLocale = navigator.language || navigator.userLanguage;

    const [game, setGame] = useState(null);
    const { gameId } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        gamevaultApiFacade
            .getGameById(gameId)
            .then((data) => {
                setGame(data);
                setLoading(false);
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [gameId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!game) {
        return <div>No game data available</div>;
    }

    return (
        <GameContainer>
            <GameTitle>{game.name}</GameTitle>
            <GameBannerContainer>
                <GameBanner src={game.background_image} alt={game.name} />
            </GameBannerContainer>

            <GameBannerInfoContainer>
                <GameBannerBasicInfoContainer>
                    <GameReleased>
                        {new Date(game.released).toLocaleDateString(
                            browserLocale,
                            {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            }
                        )}
                    </GameReleased>

                    <GameRating>
                        <RatingContainer>
                            <Star src="/filled-star-icon.svg" />
                            <span>{game.rating}</span>
                        </RatingContainer>
                        <RatingCount>{`(${game.rating_count})`}</RatingCount>
                    </GameRating>
                </GameBannerBasicInfoContainer>

                <GameGenreListContainer>
                    {game.genres
                        .sort((a, b) => a.id - b.id)
                        .map((genre) => (
                            <GameGenre key={genre.id}>{genre.name}</GameGenre>
                        ))}
                </GameGenreListContainer>
            </GameBannerInfoContainer>

            <GameDetails>
                <ReadMore html={game.description} maxLength={310} />

                <p>Metascore:</p>
                <MetascoreValue metascore={game.metacritic}>
                    {game.metacritic}
                </MetascoreValue>

                <p>Playtime: {game.playtime}</p>
                <p>
                    Platforms:{" "}
                    {game.platforms
                        .sort((a, b) => a.id - b.id)
                        .map((platform) => platform.name)
                        .join(", ")}
                </p>
            </GameDetails>
        </GameContainer>
    );
};

export default Game;
