import React from 'react';
import { Container } from 'react-bootstrap';
import ThemeToggle from './components/ThemeToggle';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <Container className="mt-5">
      <h1 className="text-center p-5">TO-DO List</h1>
      <ThemeToggle style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
      }} />
      <TaskList />
    </Container>
  );
}

export default App;
