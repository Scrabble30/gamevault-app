import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import gamevaultApiFacade from "../services/gamevaultApiFacade";

const LoginContainer = styled.div`
    padding: 1rem;
`;

const LoginTitle = styled.h1`
    font-size: 2.5rem;
    margin: 0;
`;

const LoginFormContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 4rem;
`;

const LoginFormContent = styled.form`
    background-color: rgb(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    padding: 1.5rem;
    width: 260px;
`;

const LoginFormInput = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.6rem;
    gap: 0.2rem;
`;

const Label = styled.label`
    font-weight: bold;
    cursor: pointer;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
`;

const PasswordContainer = styled.div`
    display: inline-flex;
    align-items: center;

    border: 1px solid #ccc;
    border-radius: 0.25rem;
    background-color: field;

    cursor: text;

    ${(props) =>
        props.$isFocused &&
        `
        outline: -webkit-focus-ring-color auto 1px;
        `}
`;

const PasswordInput = styled.input`
    background: none;
    border-width: 0;
    padding: 0.625rem 0 0.625rem 0.625rem;
    width: 100%;

    &:focus {
        outline: 0;
    }
`;

const EyeIconButtonContainer = styled.div`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0.15rem;
`;

const EyeIconButton = styled.button`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border-width: 0;
    padding: 0.475rem;

    &:hover {
        background-color: rgb(255, 255, 255, 0.08);
    }

    @media (hover: none) {
        &:hover {
            background-color: transparent;
        }
    }
`;

const EyeIcon = styled.img`
    height: 1rem;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin: 0;
`;

const Button = styled.button`
    width: 100%;
    padding: 0.4rem 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
    &:hover {
        background-color: #0056b3;
    }
`;

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const passwordInputRef = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setUsernameError("");
        setPasswordError("");
        setShowPassword(false);

        if (!username) {
            setUsernameError("Username is required.");
            return;
        }

        if (!password) {
            setPasswordError("Password is required.");
            return;
        }

        try {
            await gamevaultApiFacade.login(username, password);

            navigate("/");
        } catch (error) {
            if (error.status === 404 && error.message.startsWith("User")) {
                setUsernameError(error.message);
            } else if (
                error.status === 401 &&
                error.message === "Incorrect password."
            ) {
                setPasswordError(error.message);
            } else {
                console.error("Login error:", error);
            }
        }
    };

    const handleEyeIconClick = () => {
        setShowPassword(!showPassword);

        if (isPasswordFocused) {
            const input = passwordInputRef.current;
            const selectionStart = input.selectionStart;
            const selectionEnd = input.selectionEnd;

            setTimeout(() => {
                if (input) {
                    input.focus();
                    input.setSelectionRange(selectionStart, selectionEnd);
                }
            }, 0);
        }
    };

    return (
        <LoginContainer>
            <LoginTitle>Login</LoginTitle>

            <LoginFormContainer>
                <LoginFormContent onSubmit={handleLogin}>
                    <LoginFormInput>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            maxLength="25"
                            placeholder="Username"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameError && (
                            <ErrorMessage>{usernameError}</ErrorMessage>
                        )}
                    </LoginFormInput>

                    <LoginFormInput>
                        <Label htmlFor="password">Password</Label>

                        <PasswordContainer $isFocused={isPasswordFocused}>
                            <PasswordInput
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                ref={passwordInputRef}
                            />

                            <EyeIconButtonContainer>
                                <EyeIconButton
                                    type="button"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    onClick={handleEyeIconClick}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    {showPassword ? (
                                        <EyeIcon
                                            src="/eye-hide-icon.svg"
                                            alt="Hide"
                                        />
                                    ) : (
                                        <EyeIcon
                                            src="/eye-show-icon.svg"
                                            alt="Show"
                                        />
                                    )}
                                </EyeIconButton>
                            </EyeIconButtonContainer>
                        </PasswordContainer>
                        {passwordError && (
                            <ErrorMessage>{passwordError}</ErrorMessage>
                        )}
                    </LoginFormInput>

                    <Button type="submit">Login</Button>
                </LoginFormContent>
            </LoginFormContainer>
        </LoginContainer>
    );
};

export default Login;
