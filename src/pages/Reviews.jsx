import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import gamevaultApiFacade from "../services/gamevaultApiFacade";

const PageBannerContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
`;

const GameBannerContainer = styled.div`
    grid-row-start: 1;
    grid-column-start: 1;
    border-radius: 0 0 0.5rem 0.5rem;
    overflow: hidden;
`;

const GameBanner = styled.img`
    position: relative;
    width: 100%;
    height: 150px;
    object-fit: cover;
    filter: blur(5px) brightness(0.5);
    -webkit-backdrop-filter: blur(5px) brightness(0.5);
    transform: scale(1.5);
    z-index: -1;
`;

const PageBannerContent = styled.div`
    grid-row-start: 1;
    grid-column-start: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
`;

const BackButton = styled.button`
    align-self: flex-start;
    padding: 0.625rem 1.25rem;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
`;

const GameTitle = styled.h2`
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin: 0;
`;

const ReviewsContent = styled.div`
    padding: 1rem;
`;

const ReviewsTitle = styled.h1`
    font-size: 2.5rem;
    margin: 0;
`;

const GameReviews = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    margin-top: 2rem;
    padding: 0 1rem;
`;

const GameReview = styled.li`
    box-sizing: border-box;
    background-color: rgb(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    max-width: 800px;
    padding: 1rem;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    h3,
    p {
        margin: 0;
    }
`;

const GameReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const GameReviewRatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const GameReviewRatingStarIcon = styled.img`
    height: 0.8rem;
`;

const Reviews = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();

    const [reviews, setReviews] = useState([]);

    const [game, setGame] = useState(null);

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
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });

        gamevaultApiFacade
            .getAllGameReviews(gameId)
            .then((data) => setReviews(data.sort((a, b) => a.id - b.id)));
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

    const handleBack = () => {
        navigate(`/games/${gameId}`);
    };

    return (
        <div>
            <PageBannerContainer>
                <GameBannerContainer>
                    <GameBanner src={game.background_image} alt={game.name} />
                </GameBannerContainer>

                <PageBannerContent>
                    <BackButton onClick={handleBack}>Back</BackButton>
                    <GameTitle>{game.name}</GameTitle>
                </PageBannerContent>
            </PageBannerContainer>

            <ReviewsContent>
                <ReviewsTitle>Reviews</ReviewsTitle>

                <GameReviews>
                    {reviews.map((review) => (
                        <GameReview key={review.id}>
                            <GameReviewHeader>
                                <h3>{review.username}</h3>

                                <GameReviewRatingContainer>
                                    <GameReviewRatingStarIcon
                                        src="/filled-star-icon.svg"
                                        alt="Star"
                                    />
                                    <p>{review.rating}</p>
                                </GameReviewRatingContainer>
                            </GameReviewHeader>
                            <div>
                                <p>{review.review}</p>
                            </div>
                        </GameReview>
                    ))}
                </GameReviews>
            </ReviewsContent>
        </div>
    );
};

export default Reviews;
