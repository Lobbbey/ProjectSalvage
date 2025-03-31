
import NavBar from '../components/NavBar.tsx';
import {useState} from 'react'

const OnboardPage = () => {
    const [isWelcomeClosed, setWelcomeClosed] = useState(false);
    const [isSetClosed, setSetClosed] = useState(false);

    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    function closeWeclome()
    {
        setWelcomeClosed(!isWelcomeClosed);

        var welcome = document.getElementById("welcome");

        if(welcome)
            welcome.style.visibility = "hidden";

        var set = document.getElementById("set");

        if(set)
            set.style.visibility = "visible";
    }

    function closeSet()
    {
        setSetClosed(!isSetClosed);

        // Add field checks and api call
        const debt = (document.getElementById("debt") as HTMLInputElement).value;
        const savings = (document.getElementById("savings") as HTMLInputElement).value;
        const alertMessage = document.getElementById("alertmessage");

        if(alertMessage && (debt.length == 0 || savings.length == 0))
        {
            alertMessage.innerText = "Both fields must be completed.";
            alertMessage.style.visibility = "visible";

            return;
        }
        else if(alertMessage)
        {
            var result1 = parseFloat(debt);
            var result2 = parseFloat(savings);

            if (isNaN(result1) || isNaN(result2))
            {
                alertMessage.innerText = "Both fields must be numbers.";
                alertMessage.style.visibility = "visible";

                return;
            }
        }

        if(alertMessage)
            alertMessage.style.visibility = "hidden";

        var set = document.getElementById("set");

        if(set)
            set.style.visibility = "hidden";
    }

    return (
    <div className="flex flex-col absolute top-0 left-0 items-center">
        <NavBar />

        <div id="welcome" className="w-[60%] h-fit mt-[20vh] border border-[#6d91e8] rounded-lg  bg-[rgba(17,18,23,.9)] p-5">
            <h2 className='font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]'>Welcome to Salvage Financial, {parsedData.User.FName}.</h2>
            <br />
            {/*Replace below with non AI generated text.*/}
            <p className='font-[Lucida Sans] text-lg'>
                We’re here to help you take control of your finances and make smarter budgeting decisions. Whether you’re working toward a specific goal or simply want to track your spending, we’ve got the tools you need to stay on track.
                Let’s begin your path to better financial management.
            </p>
            <br />
            <p className='font-[Lucida Sans] text-lg'>
            To get started, we’ll guide you through a few simple steps to set up your budget.
            </p>
            <button className="rounded-sm inline-block h-fit w-fit p-[3px] pl-[7px] pr-[7px] bg-transparent hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mt-5 cursor-pointer" onClick={closeWeclome}>Continue</button>
        </div>
        
        <div id="set" style={{visibility:"hidden"}} className="flex flex-col w-[60%] h-fit mt-[20vh] border border-[#6d91e8] absolute z-2 rounded-lg  items-center bg-[rgba(17,18,23,.9)] p-5">
            <h2 className='font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]'>Step 1: Add Initial Information</h2>
            <br />
            
            <p className="self-start ml-[10%] mr-[10%] text-lg">In the next step, you will enter your individual debts and savings accounts. For now, enter your
                TOTAL debt and TOTAL savings.
            </p>
            <br />
            <h5 className="self-start ml-[10%] text-lg">Total Inital Debt</h5>
            <input className="w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none p-1" type="text" id="debt" placeholder="Initial Debt" />
            <br />
            <h5 className="self-start ml-[10%] text-lg">Total Initial Savings</h5>
            <input className="w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none p-1" type="text" id="savings" placeholder="Initial Savings" />
            <br />

            <h5 className="mb-1" id="alertmessage" style={{visibility:"hidden"}}></h5>

            <button className="rounded-sm inline-block h-fit w-fit p-[3px] pl-[7px] pr-[7px] bg-transparent hover:bg-blue-400/15 hover:border-[#bdc8e2] border border-[#6d91e8] text-center text-[sm] mt-5 cursor-pointer" onClick={closeSet}>Continue</button>
        </div>
        
    </div>
    );
    };

export default OnboardPage;