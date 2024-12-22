import { useState } from "react";
import { Outlet } from "react-router";
import styled from "styled-components";
import gamevaultApiFacade from "./services/gamevaultApiFacade";
//import "./App.css";

import Header from "./components/Header";

const Main = styled.main`
    display: flex;
    justify-content: center;
`;

const Content = styled.div`
    max-width: 1000px;
    width: 100%;
`;

function App() {
    const [loggedIn, setLoggedIn] = useState(gamevaultApiFacade.isLoggedIn);

    return (
        <>
            <Header loggedIn={loggedIn} />
            <Main>
                <Content>
                    <Outlet context={{ loggedIn, setLoggedIn }} />
                </Content>
            </Main>
        </>
    );
}

export default App;
