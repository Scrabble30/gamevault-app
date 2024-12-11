import styled from "styled-components";

const GameCardContainer = styled.li`
    list-style-type: none;
`;

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
`;

const GameReleased = styled.p`
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
`;

const GameCard = ({ game }) => {
    const browserLocale = navigator.language || navigator.userLanguage;

    return (
        <GameCardContainer>
            <GameBannerContainer>
                <GameBanner
                    src={game.background_image}
                    alt={game.name}
                    loading="lazy"
                />
            </GameBannerContainer>
            <GameBodyContainer>
                <GameTitle>{game.name}</GameTitle>
                <GameReleased>
                    {new Date(game.released).toLocaleDateString(browserLocale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </GameReleased>
            </GameBodyContainer>
        </GameCardContainer>
    );
};

export default GameCard;
