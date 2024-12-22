import { Link } from "react-router";
import styled from "styled-components";

const HeaderContainer = styled.header`
    position: sticky;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: grey;
    height: 3.6rem;
    top: 0;
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 1.25rem;
    max-width: 1200px;
    width: 100%;

    @media (min-width: 768px) {
        padding: 0.25rem 2.5rem;
    }
`;

const LogoContainer = styled(Link)`
    display: flex;
    align-items: center;
    height: 2.5rem;
    gap: 0.5rem;

    @media (min-width: 768px) {
        height: 2rem;
    }
`;

const Logo = styled.img`
    height: 100%;
`;

const Title = styled.img`
    height: 55%;
`;

const IconsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const SearchIcon = styled.img`
    display: block;
    height: 1.5rem;
    margin-top: 0.1rem;
`;

const UserIcon = styled.img`
    display: block;
    height: 2rem;
`;

const Login = styled(Link)`
    text-decoration: none;

    p {
        font-weight: bold;
        color: black;
    }
`;

const Header = ({ loggedIn }) => {
    return (
        <HeaderContainer>
            <HeaderContent>
                <LogoContainer to="/">
                    <Logo src="/logo.svg" alt="GameVault" />
                    <Title src="/title.svg" alt="GameVault" />
                </LogoContainer>
                <IconsContainer>
                    <SearchIcon src="/search-icon.svg" alt="Search" />
                    <Login to="/login">
                        {loggedIn ? (
                            <UserIcon src="/user-icon.svg" alt="User" />
                        ) : (
                            <p>Login</p>
                        )}
                    </Login>
                </IconsContainer>
            </HeaderContent>
        </HeaderContainer>
    );
};

export default Header;
