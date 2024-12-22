const GameVaultApiFacade = () => {
    const url = import.meta.env.VITE_API_URL;

    const handleResponse = async (response) => {
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                logout();
            }

            throw {
                status: data.status,
                message: data.message,
            };
        }

        return data;
    };

    const createOptions = (method, headers, body) => {
        let opts = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...headers,
            },
        };

        if (body) opts.body = JSON.stringify(body);

        return opts;
    };

    const getToken = () => {
        return localStorage.getItem("jwtToken");
    };

    const setToken = (token) => {
        localStorage.setItem("jwtToken", token);
    };

    const getUser = () => {
        if (getToken()) {
            const payloadBase64 = getToken().split(".")[1];
            const decodedClaims = JSON.parse(window.atob(payloadBase64));

            return {
                username: decodedClaims.username,
                roles: decodedClaims.roles,
            };
        }
    };

    const userHasAccess = (user, requiredRoles) => {
        return requiredRoles.some((role) => user.roles.includes(role));
    };

    const login = async (username, password) => {
        const opts = createOptions(
            "POST",
            {},
            {
                username,
                password,
            }
        );

        return fetch(`${url}/auth/login`, opts)
            .then(handleResponse)
            .then((data) => setToken(data.token));
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
    };

    const getAllGames = async () => {
        return fetch(`${url}/games`).then(handleResponse);
    };

    const getGameById = async (gameId) => {
        return fetch(`${url}/games/${gameId}`).then(handleResponse);
    };

    const getAllGameReviews = async (gameId) => {
        return fetch(`${url}/games/${gameId}/reviews`).then(handleResponse);
    };

    const getReviewById = async (reviewId) => {
        return fetch(`${url}/reviews/${reviewId}`).then(handleResponse);
    };

    const createReview = async (review) => {
        const opts = createOptions(
            "POST",
            {
                Authorization: `Bearer ${getToken()}`,
            },
            review
        );

        return fetch(`${url}/reviews`, opts).then(handleResponse);
    };

    const updateReview = async (reviewId, review) => {
        const opts = createOptions(
            "PUT",
            {
                Authorization: `Bearer ${getToken()}`,
            },
            review
        );

        return fetch(`${url}/reviews/${reviewId}`, opts).then(handleResponse);
    };

    return {
        getUser,
        userHasAccess,
        login,
        logout,
        getAllGames,
        getGameById,
        getAllGameReviews,
        getReviewById,
        createReview,
        updateReview,
    };
};

export default GameVaultApiFacade();
