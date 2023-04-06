import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import styled from 'styled-components';
import Header from './components/Header';
import Input from './components/Input';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
`;



function App() {
  return (
    <AppContainer>
      <Header></Header>
      <Input></Input>
    </AppContainer>
  )
}

export default App
