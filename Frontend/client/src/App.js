import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'
import Book from './components/Books/Book'
import { DataProvider } from '../src/store/GlobalState'

function App() {
  return (
    <DataProvider>
      <div className="App">
        <Router>

          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/book/:id" component={Book} exact />

        </Router>

      </div>
    </DataProvider>
  );
}

export default App;
