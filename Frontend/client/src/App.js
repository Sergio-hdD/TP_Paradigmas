import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'


function App() {
  return (
    <div className="App">
      <Router>

        <div>
          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
        </div>

      </Router>

    </div>
  );
}

export default App;
