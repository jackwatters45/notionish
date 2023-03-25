import styled from 'styled-components';
import './App.css';
import Footer from './components/utils/components/Footer';
import MainContent from './components/MainContent';
import Nav from './components/Nav';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { DatabaseContext, UserContext } from './context/context';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import useArrayOfObjects from './components/utils/custom/useArrayOfObjects';

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
    return () => {
      checkUserExists();
    };
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

  // fetching Data
  // return snapshot thing
  const [todos, setTodos, removeTodo, addTodo] = useArrayOfObjects();
  useEffect(() => {
    if (!userDbRef) return;
    const dbItemsRef = collection(userDbRef, 'dbItems');
    const unsubscribe = onSnapshot(dbItemsRef, (dbItemsSnapshot) => {
      const newDbItemsArr = dbItemsSnapshot.docs.map((doc) => {
        const { id } = doc;
        const { created, ...docData } = doc.data();
        // Move this date part to the actual display or something
        return { id, ...docData, created: new Date(created.seconds * 1000) };
      });
      setTodos(newDbItemsArr);
    });
    return () => unsubscribe();
  }, [setTodos, userDbRef]);

  const [views, setViews, removeView, addView] = useArrayOfObjects();
  useEffect(() => {
    if (!userDbRef) return;
    const viewsRef = collection(userDbRef, 'views');
    const unsubscribe = onSnapshot(viewsRef, (viewsSnapshot) => {
      const newViewsArr = viewsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setViews(newViewsArr);
    });
    return () => unsubscribe();
  }, [setViews, userDbRef]);

  const [projects, setProjects, removeProject, addProject] =
    useArrayOfObjects();
  useEffect(() => {
    if (!userDbRef) return;
    const projectsRef = collection(userDbRef, 'projects');
    const unsubscribe = onSnapshot(projectsRef, (projectsSnapshot) => {
      const newProjectArr = projectsSnapshot.docs.map((doc) => doc.get('name'));
      setProjects(newProjectArr);
    });
    return () => unsubscribe();
  }, [setProjects, userDbRef]);

  const [properties, setProperties, removeProperty, addProperty] =
    useArrayOfObjects();
  useEffect(() => {
    if (!userDbRef) return;
    const propsCollection = collection(userDbRef, 'properties');
    const unsubscribe = onSnapshot(propsCollection, (propsSnapshot) => {
      const newPropertiesArr = propsSnapshot.docs.map((doc) => {
        return { ...doc.data() };
      });
      setProperties(newPropertiesArr);
    });
    return () => unsubscribe();
  }, [setProperties, userDbRef]);

  const databaseValues = {
    views,
    setViews,
    removeView,
    addView,
    projects,
    setProjects,
    removeProject,
    addProject,
    todos,
    setTodos,
    removeTodo,
    addTodo,
    properties,
    setProperties,
    removeProperty,
    addProperty,
  };

  return (
    <AppContainer>
      <UserContext.Provider value={{ user, setUser, userDbRef }}>
        <Nav />
        <DatabaseContext.Provider value={databaseValues}>
          <MainContent />
        </DatabaseContext.Provider>
      </UserContext.Provider>
      <Footer />
    </AppContainer>
  );
};

export default App;
