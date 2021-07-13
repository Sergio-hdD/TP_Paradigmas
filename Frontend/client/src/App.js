import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home'
import Book from './components/Books/Book'
import Cart from './components/Cart'
import { DataProvider } from '../src/store/GlobalState'
import Notify from './components/Notify';
import ModalCustom from './components/ModalCustom';

function App() {
  return (
    <DataProvider>
      <div className="App">
        <Router>

          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/book/:id" component={Book} exact />
          <Route path="/cart" component={Cart} exact />

        </Router>

        <Notify />
        <ModalCustom/>

      </div>
    </DataProvider>
  );
}

export default App;
