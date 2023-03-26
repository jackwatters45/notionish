import styled from 'styled-components';
import './App.css';
import Footer from './components/utils/components/Footer';
import MainContent from './components/MainContent';
import Nav from './components/Nav';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AppContainer = styled.div`
  display: grid;
  height: 100vh;
  margin: 0 auto;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
`;

const App = () => {
  const [user, setUser] = useState();
  const [userDbRef, setUserDbRef] = useState();

  onAuthStateChanged(auth, (user) => setUser(user));

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const checkUserExists = async () => {
      const userDocSnap = await getDoc(userDocRef);
      // TODO i feel like I'm missing a step here
      if (!userDocSnap.exists()) addUser(user);
    };
    checkUserExists();
    setUserDbRef(doc(userDocRef, 'dbData', 'mainDb'));
    return () => checkUserExists();
  }, [user]);

  const addUser = async (user) => {
    try {
      await setDoc(doc(db, `users`, user.uid), {
        email: user.email,
        name: user.displayName,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <AppContainer>
      {/* <UserContext.Provider value={{ user, setUser, userDbRef }}> */}
        {userDbRef && <Nav userDbRef={userDbRef} user={user} />}
        {userDbRef && <MainContent userDbRef={userDbRef} />}
      {/* </UserContext.Provider> */}
      <Footer />
    </AppContainer>
  );
};

export default App;
