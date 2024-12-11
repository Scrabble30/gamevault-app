import { Link } from "react-router";
import styled from "styled-components";

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: grey;
`;

const LogoContainer = styled(Link)`
    height: 3rem;
`;

const Logo = styled.img`
    height: 100%;
`;

const IconsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const SearchIcon = styled.img`
    height: 2rem;
    margin-top: 0.25rem;
`;

const UserIcon = styled.img`
    height: 3rem;
`;

const Header = () => {
    return (
        <HeaderContainer>
            <LogoContainer to="/">
                <Logo src="logo.svg" alt="GameVault" />
            </LogoContainer>
            <IconsContainer>
                <SearchIcon src="search-icon.svg" alt="Search" />
                <UserIcon src="user-icon.svg" alt="User" />
            </IconsContainer>
        </HeaderContainer>
    );
};

export default Header;
