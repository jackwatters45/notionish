import styled from 'styled-components';
import './App.css';
import Footer from './components/utils/components/Footer';
import MainContent from './components/MainContent';
import Nav from './components/Nav';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { UserContext } from './components/utils/context/context';

const AppContainer = styled.div`
  display: grid;
  height: 100vh;
  margin: 0 auto;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
`;

const App = () => {
  const [user, setUser] = useState();
  onAuthStateChanged(auth, (user) => setUser(user));

  useEffect(() => {console.log(user)}, [user])

  return (
    <AppContainer>
      <UserContext.Provider value={{ user, setUser }}>
        <Nav />
        <MainContent />
      </UserContext.Provider>
      <Footer />
    </AppContainer>
  );
};

export default App;
