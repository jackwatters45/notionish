import './App.css';
import { useEffect, useRef, useState } from 'react';
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
import { DatabaseProvider } from './context/context';
import notionLogo from './assets/notion-logo-no-background.png';
import { defaultViews } from './components/utils/helpers/viewHelpers';
import { defaultProperties } from './components/utils/helpers/propertyHelpers';
import convertTimestampsToDate from './components/utils/helpers/convertTimestampsToDate';

const AppContainer = styled.div`
  display: grid;
  height: 100vh;
  margin: 0 auto;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
`;

const StyledFooter = styled(Footer)`
  grid-row-start: 3;
`;

const App = () => {
  const [user, setUser] = useState();
  const [userDbRef, setUserDbRef] = useState();

  const isLoaded = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user === null) isLoaded.current = true;
      setUser(user);
    });
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

  const [dbItems, setDbItems, removeDbItem, addDbItem] = useArrayOfObjects([]);
  const [views, setViews, removeView, addView] =
    useArrayOfObjects(defaultViews);
  const [properties, setProperties, removeProperty, addProperty] =
    useArrayOfObjects(defaultProperties);

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
          const dbItemData = convertTimestampsToDate(doc.data());
          return { ...dbItemData };
        });
        setDbItems(newDbItemsArr.sort((a, b) => a.order - b.order));

        const newViewsArr = viewsSnapshot.docs.map((doc) => {
          return { ...doc.data() };
        });
        setViews(newViewsArr);

        const newPropertiesArr = propsSnapshot.docs.map((doc) => {
          return { ...doc.data() };
        });
        setProperties(newPropertiesArr);

        isLoaded.current = true;
      } catch (e) {
        console.log('Error getting documents: ', e);
      }
    };

    fetchData();
  }, [setDbItems, setViews, setProperties, userDbRef, user]);

  const [sidebarWidth, setSidebarWidth] = useState(400);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isLoaded.current)
    return (
      <div className="loading">
        <img src={notionLogo} alt="Notion logo" className="loading-logo" />
      </div>
    );
  return (
    <BrowserRouter>
      <AppContainer>
        <Nav user={user} sidebarWidth={sidebarWidth} />
        <DatabaseProvider
          value={{ userDbRef, user, isModalOpen, setIsModalOpen, isLoaded }}
        >
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
                  addView={addView}
                  removeView={removeView}
                  dbItems={dbItems}
                  setDbItems={setDbItems}
                  addDbItem={addDbItem}
                  removeDbItem={removeDbItem}
                  properties={properties}
                  setProperties={setProperties}
                  addProperty={addProperty}
                  removeProperty={removeProperty}
                  sidebarWidth={sidebarWidth}
                />
              }
            >
              <Route
                path=":dbItemId"
                element={
                  <Sidebar
                    setSidebarWidth={setSidebarWidth}
                    sidebarWidth={sidebarWidth}
                    dbItems={dbItems}
                    setDbItems={setDbItems}
                    removeDbItem={removeDbItem}
                    properties={properties}
                    setProperties={setProperties}
                    addProperty={addProperty}
                    removeProperty={removeProperty}
                  />
                }
              />
            </Route>
          </Routes>
        </DatabaseProvider>
        <StyledFooter />
      </AppContainer>
    </BrowserRouter>
  );
};

export default App;
