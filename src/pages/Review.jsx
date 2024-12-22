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

const ReviewContent = styled.div`
    padding: 1rem;
`;

const ReviewTitle = styled.h1`
    font-size: 2.5rem;
    margin: 0;
`;

const ReviewFormContainer = styled.div`
    display: flex;
    justify-content: center;

    margin-top: 2rem;
    padding: 0 1rem;
`;

const ReviewFormContent = styled.form`
    background-color: rgb(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    padding: 1.5rem;
    max-width: 500px;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const RatingLabel = styled.label`
    margin-right: 0.5rem;
`;

const RatingSelect = styled.select`
    margin-left: 0.5rem;
`;

const ReviewTextArea = styled.textarea`
    resize: vertical;
    max-height: 250px;
    height: 250px;

    @media (min-width: 768px) {
        max-height: 160px;
        height: 160px;
    }
`;

const FormButtonsContainer = styled.div`
    display: flex;
    justify-content: space-around;
    gap: 3rem;

    @media (min-width: 768px) {
        padding: 0 2rem;
    }
`;

const FormButton = styled.button`
    width: 100%;
`;

const Review = () => {
    const navigate = useNavigate();
    const { gameId, reviewId } = useParams();

    const [user] = useState(gamevaultApiFacade.getUser);
    const [review, setReview] = useState(null);
    const [game, setGame] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                const gamePromise = gamevaultApiFacade.getGameById(gameId);
                let reviewPromise;

                if (reviewId) {
                    reviewPromise = gamevaultApiFacade.getReviewById(reviewId);
                } else {
                    reviewPromise = Promise.resolve({
                        username: user.username,
                        game_id: gameId,
                        rating: 0,
                        review: "",
                    });
                }

                const [game, review] = await Promise.all([
                    gamePromise,
                    reviewPromise,
                ]);

                setGame(game);
                setReview(review);

                if (reviewId && game.id !== review.game_id) {
                    setError("Review not found for this game");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [gameId, reviewId, user]);

    if (!user) {
        return <div>You must be logged in to view this page</div>;
    }

    if (!gamevaultApiFacade.userHasAccess(user, ["user", "admin"])) {
        return <h3>You do not have the required role to view this page</h3>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!game) {
        return <div>No game data available</div>;
    }

    if (!review) {
        return <div>No review data available</div>;
    }

    if (reviewId && review.username !== user.username) {
        return <div>You are not allowed to edit this review</div>;
    }

    const handleBackClick = () => {
        navigate(`/games/${gameId}/reviews`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(review);

        if (reviewId) {
            gamevaultApiFacade
                .updateReview(reviewId, review)
                .then(handleBackClick)
                .catch((err) => console.error(err));
        } else {
            gamevaultApiFacade
                .createReview(review)
                .then(handleBackClick)
                .catch((err) => console.error(err));
        }
    };

    const ratings = [
        { value: 1, text: "Very Poor" },
        { value: 2, text: "Poor" },
        { value: 3, text: "Below Average" },
        { value: 4, text: "Fair" },
        { value: 5, text: "Average" },
        { value: 6, text: "Good" },
        { value: 7, text: "Above Average" },
        { value: 8, text: "Very Good" },
        { value: 9, text: "Excellent" },
        { value: 10, text: "Perfect" },
    ];

    return (
        <div>
            <PageBannerContainer>
                <GameBannerContainer>
                    <GameBanner src={game.background_image} alt={game.name} />
                </GameBannerContainer>

                <PageBannerContent>
                    <BackButton onClick={handleBackClick}>
                        Back to Reviews
                    </BackButton>
                    <GameTitle>{game.name}</GameTitle>
                </PageBannerContent>
            </PageBannerContainer>

            <ReviewContent>
                <ReviewTitle>
                    {reviewId ? "Edit Review" : "Write Review"}
                </ReviewTitle>

                <ReviewFormContainer>
                    <ReviewFormContent onSubmit={handleSubmit}>
                        <RatingLabel>
                            Rating:
                            <RatingSelect
                                name="rating"
                                required
                                value={Math.round(review.rating)}
                                onChange={handleChange}
                            >
                                <option value="">Select a rating</option>
                                {ratings.reverse().map((rating) => (
                                    <option
                                        key={rating.value}
                                        value={rating.value}
                                    >
                                        {rating.value} - {rating.text}
                                    </option>
                                ))}
                            </RatingSelect>
                        </RatingLabel>
                        <ReviewTextArea
                            name="review"
                            id="review"
                            minLength={50}
                            maxLength={500}
                            placeholder="Write your review here"
                            required
                            value={review.review}
                            onChange={handleChange}
                        ></ReviewTextArea>

                        <FormButtonsContainer>
                            <FormButton onClick={handleBackClick}>
                                Cancel
                            </FormButton>
                            <FormButton type="submit">
                                {reviewId ? "Update Review" : "Publish Review"}
                            </FormButton>
                        </FormButtonsContainer>
                    </ReviewFormContent>
                </ReviewFormContainer>
            </ReviewContent>
        </div>
    );
};

export default Review;
