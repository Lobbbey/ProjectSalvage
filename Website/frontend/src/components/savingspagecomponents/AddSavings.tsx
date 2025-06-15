//import app from "../pages/App.module.css";
//import { useNavigate } from 'react-router-dom';
//import {useState} from 'react'


interface ChildProps {
    triggerRerender: () => void;
}

const AddSavings: React.FC<ChildProps> = ({ triggerRerender }) => 
{
    const today = new Date();

    async function addSavings(event: any): Promise<void>
    {
        const data = localStorage.getItem('user_data');
        const parsedData = data ? JSON.parse(data) : null;
        
        
        const Amount = parseFloat((document.getElementById("Num") as HTMLInputElement).value);
        const name = (document.getElementById("Name") as HTMLInputElement).value;
        const date = (document.getElementById("date") as HTMLInputElement).value;
        const apr = parseFloat((document.getElementById("apr") as HTMLInputElement).value);
        const alertMessage = document.getElementById("alertMessage");
        

        if (alertMessage) {
            if (date.length == 0 || name.length == 0 || Amount == undefined || isNaN(Amount) ||
                /* isButtonClicked == false || */  apr == undefined || isNaN(apr)){
                alertMessage.innerText = "Please Complete all the fields";
                alertMessage.style.color = "#ff6384";
                alertMessage.style.visibility = "visible";
                return;
            } 
        }
        
        if(parsedData.User.Savings != undefined)
            for(var i = 0; i < parsedData.User.Savings.length; i++)
            {
                if(alertMessage && parsedData.User.Savings[i].Name == name)
                {
                    alertMessage.innerText = "Duplicate name";
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
                    alertMessage.style.color = "#ff6384";
                    alertMessage.style.visibility = "visible";
                }
                
                updateInfo();
            } 
            else 
            {   
                if (alertMessage){

                    (document.getElementById("Num") as HTMLInputElement).value = "";
                    (document.getElementById("Name") as HTMLInputElement).value = "";
                    (document.getElementById("apr") as HTMLInputElement).value = "";

                    alertMessage.innerText = "Succesfully Added";
                    alertMessage.style.color = "#00c04b";
                    alertMessage.style.visibility = "visible";
                }

                await updateInfo();
                triggerRerender();
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
                    <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[3vh] text-[#ffffff]">Add an Account</span>
            </div>

            <div className="flex-col">

                <h5 className="self-start text-white ml-[10%] mt-2 text-lg text-left text-[0.95rem]">Name</h5>
                <input className="h-7 w-8/10 text-white text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type="text" placeholder = "Name" id = "Name" onKeyUp={(e) => {
                    if (e.key === "Enter") 
                    {
                      var next = document.getElementById("Num") as HTMLInputElement;
                      next.focus();
                    }
                  }}></input>

            
                <h5 className="self-start text-white ml-[10%] text-lg text-left text-[0.95rem]">Amount</h5>
                <input className="h-7 w-8/10 text-white text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type="text" placeholder = "Amount" id = "Num" onKeyUp={(e) => {
                    if (e.key === "Enter") 
                    {
                      var next = document.getElementById("date") as HTMLInputElement;
                      next.focus();
                    }
                  }}></input>

            
                <h5 className="self-start ml-[10%] text-white text-lg text-left text-[0.95rem]">Date</h5>
                <input className="h-7 w-8/10 text-lg text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" defaultValue={(today.getMonth() + 1) + "/" + today.getDate() + "/" +today.getFullYear()} type="text" placeholder = "MM/DD/YYYY" id = "date"onKeyUp={(e) => {
                    if (e.key === "Enter") 
                    {
                      var next = document.getElementById("apr") as HTMLInputElement;
                      next.focus();
                    }
                  }}></input>

                <h5 className="self-start ml-[10%] text-white text-lg text-left text-[0.9rem]">Interest Rate (APR)</h5>
                <input className="h-7 w-8/10 text-lg text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type="text" placeholder = "1.23" id = "apr"></input>

                <div className="fixed top-[80%] w-[100%] flex items-center justify-between">
                    <h5 className="ml-[10%] text-[#ff6384]" id="alertMessage"></h5>
                    <button id = "AddIncome" className = "rounded-sm inline-block h-fit w-fit mr-[10%] p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {addSavings} >Add Account</button>
                </div> 
            </div> 
        </div>
    );
}

export default AddSavings;