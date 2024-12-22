import styled from "styled-components";
import { Link } from "react-router";

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem;
    height: 60vh;
`;

const Title = styled.h1`
    font-size: 5rem;
    margin: 0;
`;

const Message = styled.h2`
    font-size: 2rem;
`;

const Description = styled.p`
    font-size: 1.25rem;
    margin-bottom: 20px;
`;

const StyledLink = styled(Link)`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;

    &:hover {
        background-color: #0056b3;
    }
`;

const ErrorPage = ({ statusCode, description }) => {
    let title, message, defaultDescription;

    switch (statusCode) {
        case 404:
            title = "404";
            message = "Oops! Page Not Found";
            defaultDescription =
                "Sorry, the page you are looking for does not exist or has been moved.";
            break;
        case 401:
            title = "401";
            message = "Unauthorized Access";
            defaultDescription = "You need to log in to access this page.";
            break;
        case 403:
            title = "403";
            message = "Forbidden";
            defaultDescription =
                "You do not have permission to view this page.";
            break;
        default:
            title = "Error";
            message = "Something went wrong";
            defaultDescription =
                "An unexpected error has occurred. Please try again later.";
            break;
    }

    return (
        <ErrorContainer>
            <Title>{title}</Title>
            <Message>{message}</Message>
            <Description>{description || defaultDescription}</Description>
            <StyledLink to="/">Go Back Home</StyledLink>
        </ErrorContainer>
    );
};

export default ErrorPage;
