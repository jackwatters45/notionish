  // fetching Data
  // const [dbItems, setDbItems, removeDbItem, addDbItem] = useArrayOfObjects();
  // useEffect(() => {
  //   if (!userDbRef) return;
  //   const fetchDbItems = async () => {
  //     const dbItemsRef = collection(userDbRef, 'dbItems');
  //     const dbItemsSnapshot = await getDocs(dbItemsRef);
  //     const newDbItemsArr = dbItemsSnapshot.docs.map((doc) => {
  //       const { id } = doc;
  //       const { created, ...docData } = doc.data();
  //       // Move this date part to the actual display or something
  //       return { id, ...docData, created: new Date(created.seconds * 1000) };
  //     });
  //     setDbItems(newDbItemsArr);
  //   };
  //   fetchDbItems();
  // }, [setDbItems, userDbRef]);

  // const [views, setViews, removeView, addView] = useArrayOfObjects();
  // useEffect(() => {
  //   if (!userDbRef) return;
  //   const fetchView = async () => {
  //     const viewsRef = collection(userDbRef, 'views');
  //     const viewsSnapshot = await getDocs(viewsRef);
  //     const newViewsArr = viewsSnapshot.docs.map((doc) => {
  //       return { ...doc.data() };
  //     });
  //     setViews(newViewsArr);
  //   };
  //   fetchView();
  // }, [setViews, userDbRef]);

  // const [properties, setProperties, removeProperty, addProperty] =
  //   useArrayOfObjects();
  // useEffect(() => {
  //   if (!userDbRef) return;
  //   const fetchProperties = async () => {
  //     const propsCollection = collection(userDbRef, 'properties');
  //     const propsSnapshot = await getDocs(propsCollection);
  //     const newPropertiesArr = propsSnapshot.docs.map((doc) => {
  //       return { ...doc.data() };
  //     });
  //     setProperties(newPropertiesArr);
  //   };
  //   fetchProperties();
  // }, [setProperties, userDbRef]);