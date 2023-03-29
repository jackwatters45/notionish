import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import styled from 'styled-components';
import Nav from './components/Nav';
import Footer from './components/Footer';
import RootLayout from './components/RootLayout';
import Sidebar from './components/Sidebar/Sidebar';
import useArrayOfObjects from './components/utils/custom/useArrayOfObjects';
import { DatabaseContext } from './context/context';
import notionLogo from './assets/notion-logo-no-background.png';

const AppContainer = styled.div`
  display: grid;
  height: 100vh;
  margin: 0 auto;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
`;

// TODO need to allow user to use without logging in and just not saving
const App = () => {
  const [user, setUser] = useState();
  const [userDbRef, setUserDbRef] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);

  const addUser = async ({ email, displayName, uid }) => {
    try {
      await setDoc(doc(db, `users`, uid), {
        email,
        name: displayName,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const fetchUserDbRef = async () => {
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) addUser(user);
        setUserDbRef(doc(userDocRef, 'dbData', 'mainDb'));
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserDbRef();
  }, [user]);

  const [dbItems, setDbItems, removeDbItem, addDbItem] = useArrayOfObjects();
  const [views, setViews, removeView, addView] = useArrayOfObjects();
  const [properties, setProperties, removeProperty, addProperty] =
    useArrayOfObjects();

  // fetching data
  useEffect(() => {
    if (!userDbRef) return;
    const fetchData = async () => {
      const dbItemsRef = collection(userDbRef, 'dbItems');
      const viewsRef = collection(userDbRef, 'views');
      const propsCollection = collection(userDbRef, 'properties');

      try {
        const [dbItemsSnapshot, viewsSnapshot, propsSnapshot] =
          await Promise.all([
            getDocs(dbItemsRef),
            getDocs(viewsRef),
            getDocs(propsCollection),
          ]);

        const newDbItemsArr = dbItemsSnapshot.docs.map((doc) => {
          const { id } = doc;
          const { created, ...docData } = doc.data();
          return { id, ...docData, created: new Date(created.seconds * 1000) };
        });
        setDbItems(newDbItemsArr);

        const newViewsArr = viewsSnapshot.docs.map((doc) => {
          return { ...doc.data() };
        });
        setViews(newViewsArr);

        const newPropertiesArr = propsSnapshot.docs.map((doc) => {
          return { ...doc.data() };
        });
        setProperties(newPropertiesArr);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [setDbItems, setViews, setProperties, userDbRef]);

  const databaseValues = {
    userDbRef,
    views,
    dbItems,
    setDbItems,
    removeDbItem,
    addDbItem,
    properties,
    setProperties,
    removeProperty,
    addProperty,
  };

  useEffect(() => {
    console.log(views);
  }, [views]);

  // Sidebar + RootLayout width calculation
  const [sidebarWidth, setSidebarWidth] = useState(400);

  if (!user) return <Nav userDbRef={userDbRef} user={user} />;
  return views?.length ? (
    <BrowserRouter>
      <AppContainer>
        <Nav userDbRef={userDbRef} user={user} />
        <DatabaseContext.Provider value={databaseValues}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={`${views[0].id}`} replace />}
            />
            <Route
              path=":viewId"
              element={
                <RootLayout
                  views={views}
                  setViews={setViews}
                  removeView={removeView}
                  addView={addView}
                  dbItems={dbItems}
                  setDbItems={setDbItems}
                  sidebarWidth={sidebarWidth}
                  properties={properties}
                />
              }
            >
              {/* <Route
                path=":dbItemId"
                element={
                  <Sidebar
                    setSidebarWidth={setSidebarWidth}
                    sidebarWidth={sidebarWidth}
                    dbItems={dbItems}
                    properties={properties}
                    removeDbItem={removeDbItem}
                  />
                }
              /> */}
            </Route>
          </Routes>
        </DatabaseContext.Provider>
        <Footer />
      </AppContainer>
    </BrowserRouter>
  ) : (
    <div className="loading">
      <img src={notionLogo} alt="Notion logo" className="loading-logo" />
    </div>
  );
};

export default App;
