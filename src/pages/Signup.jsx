import { useState, useRef } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import styled from "styled-components";
import gamevaultApiFacade from "../services/gamevaultApiFacade";

const SignUpContainer = styled.div`
    padding: 1rem;
`;

const SignUpTitle = styled.h1`
    font-size: 2.5rem;
    margin: 0;
`;

const SignUpFormContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 4rem;
`;

const SignUpFormContent = styled.form`
    background-color: rgb(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    padding: 1.5rem;
    width: 260px;
`;

const LoginPrompt = styled.p`
    margin: 0 0 1rem 0;

    a:visited {
        color: rgb(158, 158, 255);
    }
`;

const SignUpFormInput = styled.div`
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

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
        useState(false);

    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    const { setLoggedIn } = useOutletContext();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setUsernameError("");
        setPasswordError("");
        setConfirmPasswordError("");

        if (!username) {
            setUsernameError("Username is required.");
            return;
        }

        if (!password) {
            setPasswordError("Password is required.");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }

        const passwordInput = passwordInputRef.current;
        const confirmPasswordInput = confirmPasswordInputRef.current;
        passwordInput.type = "password";
        confirmPasswordInput.type = "password";

        try {
            await gamevaultApiFacade.signup(username, password);

            setLoggedIn(true);
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

    const handleEyeIconClick = (field) => {
        if (field === "password") {
            setShowPassword(!showPassword);
            if (isPasswordFocused) {
                focusAndSelectInput(passwordInputRef);
            }
        } else {
            setShowConfirmPassword(!showConfirmPassword);
            if (isConfirmPasswordFocused) {
                focusAndSelectInput(confirmPasswordInputRef);
            }
        }
    };

    const focusAndSelectInput = (ref) => {
        const input = ref.current;
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;

        setTimeout(() => {
            if (input) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            }
        }, 0);
    };

    return (
        <SignUpContainer>
            <SignUpTitle>Sign Up</SignUpTitle>

            <SignUpFormContainer>
                <SignUpFormContent onSubmit={handleSignUp}>
                    <LoginPrompt>
                        Already have an account? <Link to="/login">Login</Link>
                    </LoginPrompt>

                    <SignUpFormInput>
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
                    </SignUpFormInput>

                    <SignUpFormInput>
                        <Label htmlFor="password">Password</Label>
                        <PasswordContainer $isFocused={isPasswordFocused}>
                            <PasswordInput
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Password"
                                autoComplete="new-password"
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
                                    onClick={() =>
                                        handleEyeIconClick("password")
                                    }
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <EyeIcon
                                        src={
                                            showPassword
                                                ? "/eye-hide-icon.svg"
                                                : "/eye-show-icon.svg"
                                        }
                                        alt={showPassword ? "Hide" : "Show"}
                                    />
                                </EyeIconButton>
                            </EyeIconButtonContainer>
                        </PasswordContainer>
                        {passwordError && (
                            <ErrorMessage>{passwordError}</ErrorMessage>
                        )}
                    </SignUpFormInput>

                    <SignUpFormInput>
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>
                        <PasswordContainer
                            $isFocused={isConfirmPasswordFocused}
                        >
                            <PasswordInput
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                onFocus={() =>
                                    setIsConfirmPasswordFocused(true)
                                }
                                onBlur={() =>
                                    setIsConfirmPasswordFocused(false)
                                }
                                ref={confirmPasswordInputRef}
                            />
                            <EyeIconButtonContainer>
                                <EyeIconButton
                                    type="button"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    onClick={() =>
                                        handleEyeIconClick("confirmPassword")
                                    }
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <EyeIcon
                                        src={
                                            showConfirmPassword
                                                ? "/eye-hide-icon.svg"
                                                : "/eye-show-icon.svg"
                                        }
                                        alt={
                                            showConfirmPassword
                                                ? "Hide"
                                                : "Show"
                                        }
                                    />
                                </EyeIconButton>
                            </EyeIconButtonContainer>
                        </PasswordContainer>
                        {confirmPasswordError && (
                            <ErrorMessage>{confirmPasswordError}</ErrorMessage>
                        )}
                    </SignUpFormInput>

                    <Button type="submit">Sign Up</Button>
                </SignUpFormContent>
            </SignUpFormContainer>
        </SignUpContainer>
    );
};

export default SignUp;
