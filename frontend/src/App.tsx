import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import styled from 'styled-components';
import Header from './components/Header';


const AppContainer = styled.div`
  display: flex;
  justify-content: center;
`;



function App() {
  return (
    <AppContainer>
      <Header></Header>
    </AppContainer>
  )
}

export default App
