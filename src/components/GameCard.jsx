import { Link } from "react-router";
import styled from "styled-components";

const GameBannerContainer = styled.div`
    width: 256px;
    height: 144px;
`;

const GameBanner = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
`;

const GameBodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.25rem;
    gap: 0.5rem;
`;

const GameTitle = styled.h3`
    margin: 0;

    a {
        color: rgba(255, 255, 255, 0.87);
        text-decoration: none;
        font-weight: bold;
    }
`;

const GameReleased = styled.p`
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
`;

const GameCard = ({ game }) => {
    const browserLocale = navigator.language || navigator.userLanguage;

    return (
        <li>
            <GameBannerContainer>
                <Link to={`/games/${game.id}`}>
                    <GameBanner
                        src={game.background_image}
                        alt={game.name}
                        loading="lazy"
                    />
                </Link>
            </GameBannerContainer>
            <GameBodyContainer>
                <GameTitle>
                    <Link to={`/games/${game.id}`}>{game.name}</Link>
                </GameTitle>

                <GameReleased>
                    {new Date(game.released).toLocaleDateString(browserLocale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </GameReleased>
            </GameBodyContainer>
        </li>
    );
};

export default GameCard;
