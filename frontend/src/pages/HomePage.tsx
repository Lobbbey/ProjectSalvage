import NavBar from '../components/NavBar.tsx';
import app from './App.module.css';

const HomePage = () => {
  return (
    <div>
        <NavBar />
        <div id = {app.main}>

        </div>
    </div>
  );
};

export default HomePage;
