import NavBar from '../components/NavBar.tsx';
import app from './App.module.css';

const HomePage = () => {
  return (
    <div>
        <NavBar />
        <div id = {app.main}>
            <h1 className={app.tagline}>The ocean never apologizes for its vastness. Neither should you for wanting financial freedom.</h1>
        </div>
    </div>
  );
};

export default HomePage;
