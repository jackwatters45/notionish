import React, { useState } from 'react';
import styled from 'styled-components';
import { auth } from '../firebase';
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import Icon from '@mdi/react';
import { mdiGoogle, mdiGithub, mdiFacebook } from '@mdi/js';
import { hoverStyle } from '../context/theme';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 108px;
  padding: 60px 0px 20px;
  align-items: end;
`;

const Header = styled.h1`
  display: flex;
  margin-bottom: 20px;
  justify-content: end;
  flex-direction: column;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: start;
  height: 100%;
`;

const LoginText = styled.h3`
  font-weight: 300;
  font-size: 14px;
`;

const LoginIcons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const StyledButton = styled.button`
  color: var(--main-font-color);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  height: 1.5rem;
  padding: 1px;
  width: 1.5rem;
  background-color: var(--section-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 10%) 0px 2px 4px;
  &:hover {
    ${hoverStyle}
  }
`;

const StyledPopupIcon = styled(Icon)`
  margin: auto;
`;

const ErrorDiv = styled.div`
  height: 18px;
  display: flex;
  justify-content: center;
`;

const Error = styled.p`
  font-size: 12px;
  display: flex;
  padding: 0px 4px;
  width: fit-content;
`;

const LogOutButton = styled.button`
  font: inherit;
  font-weight: 300;
  text-decoration: underline;
  background-color: transparent;
  border: inherit;
  color: var(--main-font-color);
`;

const Nav = ({ user }) => {
  const [isErrorMessage, setIsErrorMessage] = useState();

  const signOutUser = async () => {
    await signOut(auth);
    setIsErrorMessage(false);
  };

  const trySignInPopup = async (provider) => {
    try {
      return await signInWithPopup(auth, provider);
    } catch {
      setIsErrorMessage(true);
    }
  };

  const loginGoogle = async () => trySignInPopup(new GoogleAuthProvider());
  const loginGithub = async () => trySignInPopup(new GithubAuthProvider());
  const loginFacebook = async () => trySignInPopup(new FacebookAuthProvider());

  return (
    <Container>
      <Link to={'/'}>
        <Header>Notion Todo Clone</Header>
      </Link>
      <LoginContainer>
        {user ? (
          <>
            <LoginText>Welcome, {user.displayName || user.email}</LoginText>
            <LogOutButton onClick={signOutUser}>Sign Out</LogOutButton>
          </>
        ) : (
          <>
            <LoginText>Login to save your data</LoginText>
            <LoginIcons>
              <StyledButton onClick={loginGoogle}>
                <StyledPopupIcon path={mdiGoogle} size={0.9} />
              </StyledButton>
              <StyledButton onClick={loginGithub}>
                <StyledPopupIcon path={mdiGithub} size={0.95} />
              </StyledButton>
              <StyledButton onClick={loginFacebook}>
                <StyledPopupIcon path={mdiFacebook} size={0.95} />
              </StyledButton>
            </LoginIcons>
            <ErrorDiv>
              {isErrorMessage && (
                <Error>
                  'There was an error signing in. Please try again or use a
                  different method.'
                </Error>
              )}
            </ErrorDiv>
          </>
        )}
      </LoginContainer>
    </Container>
  );
};

export default Nav;
