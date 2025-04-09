//import app from "../pages/App.module.css";
//import { useNavigate } from 'react-router-dom';
//import {useState} from 'react'


interface ChildProps {
    triggerRerender: () => void;
}

const AddSavings: React.FC<ChildProps> = ({ triggerRerender }) => {

    //const [isButtonClicked, setButton] = useState(false);

    /* function setYes(){
        setRecurring(true);
        setButton(true);
    }

    function setNo(){
        setRecurring(false);
        setButton(true);
    }
 */

    async function addSavings(event: any): Promise<void>{
        
        const Amount = parseFloat((document.getElementById("Num") as HTMLInputElement).value);
        const name = (document.getElementById("Name") as HTMLInputElement).value;
        const date = (document.getElementById("date") as HTMLInputElement).value;
        const apr = parseFloat((document.getElementById("date") as HTMLInputElement).value);
        const alertMessage = document.getElementById("alertMessage");
        

        if (alertMessage) {
            if (date.length == 0 || name.length == 0 || Amount == undefined || 
                /* isButtonClicked == false || */  apr == undefined){
                alertMessage.innerText = "Please Complete all the fields";
                alertMessage.style.visibility = "visible";
                return;
            } 
        }
       
        const token = localStorage.getItem('token');
        
        const [month, day, year] = date.split("/");
        const InitialTime = {Month: parseInt(month), Day: parseInt(day), Year: parseInt(year)};

        console.log(InitialTime);
        event.preventDefault();
        var obj = {Name: name, Amount: Amount, APR: apr, InitialTime: InitialTime};
        var js = JSON.stringify(obj);

        try {
            const response = await fetch('http://salvagefinancial.xyz:5000/api/AddSaving',
            {method:'POST',body:js,headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            var res = JSON.parse(await response.text());
            
            if (res.Result != "Added saving to user")
            {  
                if (alertMessage){
                    alertMessage.innerText = "Unsuccesfully Added";
                    alertMessage.style.visibility = "visible";
                }
                
                updateInfo();
            } 
            else 
            {   
                if (alertMessage){
                    alertMessage.innerText = "Succesfully Added";
                    alertMessage.style.visibility = "visible";
                }

                await updateInfo();
                triggerRerender()
            }
        } 
        catch(error: any) 
        {
            alert(error.toString());
            return;
        }
    }
    
    async function updateInfo() : Promise<void>
    {
        var token = localStorage.getItem('token');

        try
        {
            const response = await fetch('http://salvagefinancial.xyz:5000/api/ShowAllInfo',
            {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            var res = JSON.parse(await response.text());
            if( res.Result == "invalid token")
            {
            console.log("FAILED IN SETINFO FUNCTION");
            }
            else
            {
            //console.log(JSON.stringify(res));
            localStorage.setItem('user_data', JSON.stringify(res));
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    }

    return(
        <div id = "visual">
            
            <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[3vh] text-[#ffffff]">Add Savings</span>
                </div>

                <h5 className="self-start ml-[10%] mt-2 text-lg text-left text-[0.95rem]">Name</h5>
                <input className="h-7 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none p-1" type="text" placeholder = "Name" id = "Name"></input>

            
                <h5 className="self-start ml-[10%] text-lg text-left text-[0.95rem]">Amount</h5>
                <input className="h-7 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none p-1" type="text" placeholder = "Amount" id = "Num"></input>

            
                <h5 className="self-start ml-[10%] text-lg text-left text-[0.95rem]">Date</h5>
                <input className="h-7 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none p-1" type="text" placeholder = "MM/DD/YYYY" id = "date"></input>

                <h5 className="self-start ml-[10%] text-lg text-left text-[0.9rem]">Interest Rate (APR)</h5>
                <input className="h-7 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none p-1" type="text" placeholder = "1.23" id = "apr"></input>

                <h5 className="fixed top-[68.5%] left-[33.5%] mt-3 text-[0.95rem]" id="alertMessage"></h5>

                <button id = "ExpenseAdd" className = "rounded-sm inline-block absolute top-[83%] left-[42%] h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {addSavings}>Add Account</button>
                
        </div>
    );
}

export default AddSavings;