import './App.css';
import {HashRouter as Router, Route} from 'react-router-dom';
import HomePage from './pages/users/Homepage'
import Admin from './pages/admin/Admin';
import Userdashboard from './pages/users/Userdashboard';
import Login from './pages/users/Login';
import SignUp from './pages/users/SignUp';
import Chat from './pages/users/Chat'
import Navbar from './pages/components/Navbar';
import Admindashboard from './pages/admin/Admindashboard';
import Adminchat from './pages/admin/Adminchat';
function App() {
  return (
    <>
    <Navbar></Navbar>
    <Router>
      <Route path='/' exact component={HomePage} />
      <Route path='/admin' exact component={Admin} />
      <Route path='/admin/:adminId/dashboard' exact component={Admindashboard} />
      <Route path='/:userId/dashboard' exact component={Userdashboard} />
      <Route path='/login' exact component={Login} />
      <Route path='/signup' exact component={SignUp} />
      <Route path='/:userId/dashboard/:chatId' exact component={Chat} />
      <Route path='/admin/:adminId/dashboard/:chatId' exact component={Adminchat} />
    </Router>
    </>
  );
}

export default App;
