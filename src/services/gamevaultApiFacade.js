const GameVaultApiFacade = () => {
    const url = import.meta.env.VITE_API_URL;

    const handleResponse = async (response) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    };

    const getAllGames = async () => {
        const response = await fetch(`${url}/games`);
        return handleResponse(response);
    };

    const getGameById = async (gameId) => {
        return fetch(`${url}/games/${gameId}`).then(handleResponse);
    };

    return {
        getAllGames,
        getGameById,
    };
};

export default GameVaultApiFacade();
