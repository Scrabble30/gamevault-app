import styled from "styled-components";
import GameCard from "./GameCard";

const GameScrollerContainer = styled.li`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const GameScrollerTitle = styled.h2`
    padding: 0rem 1rem;
    margin: 0;
`;

const ScrollerContainer = styled.ul`
    display: flex;
    overflow-x: scroll;
    padding: 0 0 0.5rem 0;
    list-style-type: none;

    li:not(:first-child):not(:last-child) {
        /* Styles for all li elements except first and last */
        margin-left: 2rem;
    }

    li:first-child {
        /* Styles for the first li element */
        margin-left: 1rem;
    }

    li:last-child {
        /* Styles for the last li element */
        margin-right: 1rem;
    }
`;

const ScrollerFiller = styled.li``;

const GameScroller = ({ title, games }) => {
    return (
        <GameScrollerContainer>
            <GameScrollerTitle>{title}</GameScrollerTitle>

            <ScrollerContainer>
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
                <ScrollerFiller />
            </ScrollerContainer>
        </GameScrollerContainer>
    );
};

export default GameScroller;
