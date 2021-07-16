import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home'
import Book from './components/Books/Book'
import BookCreate from './components/Books/CreateBook'
import EditBook from './components/Books/EditBook'
import BookIndex from './components/Books/BookIndex'
import CreateBook from './components/Books/CreateBook'
import Cart from './components/Cart'
import { DataProvider } from '../src/store/GlobalState'
import Notify from './components/Notify';
import ModalCustom from './components/ModalCustom';
import Navbar from './components/Navbar';

function App() {
  return (
    <DataProvider>
      <div className="App">

        <Router>

          <Navbar />


          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/book/:id" component={Book} exact />
          <Route path="/books/edit/:id" component={EditBook} exact />
          <Route path="/books" component={BookIndex} exact />
          <Route path="/books/new" component={BookCreate} exact />
          <Route path="/cart" component={Cart} exact />

        </Router>

        <Notify />
        <ModalCustom />

      </div>
    </DataProvider>
  );
}

export default App;
