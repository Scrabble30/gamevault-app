import { Outlet } from "react-router";
import styled from "styled-components";
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
    return (
        <>
            <Header />
            <Main>
                <Content>
                    <Outlet />
                </Content>
            </Main>
        </>
    );
}

export default App;
