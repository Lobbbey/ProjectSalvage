import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import ForgotPage from './pages/ForgotPage.tsx';
import FinancialsPage from './pages/FinancialsPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import DebtPage from './pages/DebtPage.tsx';
import SavingsPage from './pages/SavingsPage.tsx';
import OnboardPage from './pages/OnboardPage.tsx';

const isLoggedIn = () => 
{
  return localStorage.getItem('token') != null;
};

const PrivateRoute = ({ children }: { children: any }) => 
{
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App()
{
  return(
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot" element = {<ForgotPage />} />
        <Route path="/financials" element = {<PrivateRoute> <FinancialsPage /> </PrivateRoute>} />
        <Route path="/dashboard" element = {<PrivateRoute> <DashboardPage /> </PrivateRoute>} />
        <Route path="/debt" element = {<PrivateRoute> <DebtPage /> </PrivateRoute>} />
        <Route path="/savings" element = {<PrivateRoute> <SavingsPage /> </PrivateRoute>} />
        <Route path="/onboard" element = {<PrivateRoute> <OnboardPage /> </PrivateRoute>} />
        <Route path="*" element={<HomePage />} /> {/* default */}
      </Routes>
    </Router>
  )
}
export default App;