import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import styled from "styled-components";
import gamevaultApiFacade from "../services/gamevaultApiFacade";
import ErrorPage from "./ErrorPage";
import ReadMore from "../components/ReadMore";

const LoadingText = styled.h3`
    padding: 1rem;
    margin: 0;
`;

const PageBannerContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
`;

const GameBannerContainer = styled.div`
    grid-row-start: 1;
    grid-column-start: 1;
    overflow: hidden;

    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.8)
    );
`;

const GameBanner = styled.img`
    position: relative;
    display: block;
    width: 100%;
    height: 400px;
    object-fit: cover;
    z-index: -1;
`;

const PageBannerContent = styled.div`
    grid-row-start: 1;
    grid-column-start: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1rem;
`;

const GameTitle = styled.h1`
    font-size: 2rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

    @media (min-width: 768px) {
        font-size: 3rem;
    }
`;

const MetaInfo = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    padding: 0;
    margin: 0;
    list-style-type: none;
`;

const MetaItem = styled.li`
    background-color: rgba(0, 0, 0, 0.6);
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9rem;
    display: inline-flex;
`;

const UserRating = styled.span`
    display: flex;
`;

const RatingContainer = styled.span`
    display: inline-flex;
    align-items: center;
    margin-left: 0.4rem;
    gap: 0.2rem;
`;

const StarIcon = styled.img`
    height: 0.8rem;
`;

const MetacriticScoreValue = styled.span`
    font-weight: bold;
    color: ${(props) => {
        if (props.$score >= 75) return "#66cc33";
        if (props.$score >= 50) return "#ffcc33";
        return "#ff0000";
    }};
`;

const Content = styled.div`
    background-color: #1a1a1a;
    padding: 20px;

    @media (min-width: 768px) {
        padding: 20px 40px;
    }
`;

const Section = styled.section`
    margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 15px;
    margin-top: 0;
    border-bottom: 2px solid #4a90e2;
    padding-bottom: 5px;
`;

const GameDescription = styled.div`
    line-height: 1.6;
    font-size: 1rem;

    h1,
    h2,
    h3 {
        margin: 0.8rem 0 0.2rem 0;
    }

    p {
        margin: 0;
    }
`;

const List = styled.ul`
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const ListItem = styled.li`
    background-color: #333;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9rem;
`;

const ReviewsButton = styled.button`
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: #357abd;
    }

    @media (min-width: 768px) {
        width: auto;
    }
`;

const Game = () => {
    const [game, setGame] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { gameId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameData = async () => {
            setLoading(true);
            setError(null);

            try {
                const gameData = await gamevaultApiFacade.getGameById(gameId);
                setGame(gameData);
            } catch (error) {
                if (error.status !== 404) setError(error.message);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameData();
    }, [gameId]);

    if (loading) {
        return <LoadingText>Loading...</LoadingText>;
    }

    if (error) {
        return <ErrorPage description={error} />;
    }

    if (!game) {
        return <ErrorPage statusCode={404} />;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleReviewsClick = () => {
        navigate(`/games/${gameId}/reviews`);
    };

    return (
        <div>
            <PageBannerContainer>
                <GameBannerContainer>
                    <GameBanner src={game.background_image} alt={game.name} />
                </GameBannerContainer>

                <PageBannerContent>
                    <GameTitle>{game.name}</GameTitle>
                    <MetaInfo>
                        <MetaItem>
                            Released: {formatDate(game.released)}
                        </MetaItem>
                        <MetaItem>Playtime: {game.playtime} hours</MetaItem>
                        <MetaItem>
                            <UserRating>
                                User Rating:
                                {game.rating && game.rating_count ? (
                                    <RatingContainer>
                                        <StarIcon src="/filled-star-icon.svg" />
                                        <span>
                                            {game.rating} ({game.rating_count})
                                        </span>
                                    </RatingContainer>
                                ) : (
                                    <span>N/A</span>
                                )}
                            </UserRating>
                        </MetaItem>
                        <MetaItem>
                            <span>Metascore: </span>
                            <MetacriticScoreValue $score={game.metacritic}>
                                {game.metacritic}
                            </MetacriticScoreValue>
                        </MetaItem>
                    </MetaInfo>
                </PageBannerContent>
            </PageBannerContainer>

            <Content>
                <Section>
                    <SectionTitle>Description</SectionTitle>
                    <GameDescription>
                        <ReadMore html={game.description} maxLength={300} />
                        {/*expanded ? (
                            <>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: game.description,
                                    }}
                                />
                                <ReadLessButton
                                    onClick={() => setExpanded(false)}
                                >
                                    Show less
                                </ReadLessButton>
                            </>
                        ) : (
                            <>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            game.description.slice(0, 300) +
                                            "...",
                                    }}
                                />
                                <ReadMoreButton
                                    onClick={() => setExpanded(true)}
                                >
                                    Read more
                                </ReadMoreButton>
                            </>
                        )*/}
                    </GameDescription>
                </Section>
                <Section>
                    <SectionTitle>Genres</SectionTitle>
                    <List>
                        {game.genres.map((genre) => (
                            <ListItem key={genre.id}>{genre.name}</ListItem>
                        ))}
                    </List>
                </Section>
                <Section>
                    <SectionTitle>Platforms</SectionTitle>
                    <List>
                        {game.platforms.map((platform) => (
                            <ListItem key={platform.id}>
                                {platform.name}
                            </ListItem>
                        ))}
                    </List>
                </Section>
                <ReviewsButton onClick={handleReviewsClick}>
                    See Reviews
                </ReviewsButton>
            </Content>
        </div>
    );
};

export default Game;
