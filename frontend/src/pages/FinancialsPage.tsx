import NavBar from '../components/NavBar.tsx';
import app from './App.module.css';

const FinancialsPage = () => {
  return (
    <div id = {app.finance}>
        <NavBar />
        <div id = {app.main}>

        </div>
    </div>
  );
};

export default FinancialsPage;
