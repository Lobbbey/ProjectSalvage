
import NavBar from '../components/NavBar.tsx';
import logo from '../assets/testlogo.png'
import ForgotPass from '../components/ForgotPass.tsx';


const ForgotPage = () => {
    return (
        <div className="mt-10 flex flex-col">
            <NavBar/>
            <div className="block bg-[rgba(17,18,23,0.9)] absolute w-[30%] min-h-fit h-[45%] top-1/2 left-1/2 border border-[#6d91e8] border-[1.5px] rounded-[2%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                <img src = {logo} className ="w-[15%] h-auto mt-[5%] ml-[41%]" alt="anchor"></img>
                <ForgotPass />
            </div>
        </div>
    );
}

export default ForgotPage;