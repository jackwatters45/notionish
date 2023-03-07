import styled from 'styled-components';
import './App.css';
import Footer from './components/utils/components/Footer';
import MainContent from './components/MainContent';

const AppContainer = styled.div`
  display: grid;
  height: 100vh;
  margin: 0 auto;
  grid-template-rows: 120px 1fr 30px;
  overflow: hidden;
`;

const Header = styled.h1`
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin: 0px 70px;
  padding: 10px 0px;
`;

const App = () => {
  return (
    <AppContainer>
      <Header>Notion Todo Clone</Header>
      <MainContent />
      <Footer />
    </AppContainer>
  );
};

export default App;
