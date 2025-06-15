//import app from "../pages/App.module.css";
//import { useNavigate } from 'react-router-dom';
import {useState} from 'react'


interface ChildProps {
    triggerRerender: () => void;
}

interface Item 
{
    key:string;
    Name: string;
    Date: any;
    Amount: any;
    APR: any;
}

const AddIncome: React.FC<ChildProps> = ({ triggerRerender }) => {
    var otoday = new Date();

    const [isRecurring, setRecurring] = useState(false);
    const [isButtonClicked, setButton] = useState(false);
    const [selectedItemObject, setSelectedItemObject] = useState<Item | null>(null);
    const [selectedItemKey, setSelectedItemKey] = useState<string>('');

    const itemsList = setSavings();

    const handleItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => 
    {
        const selectedKey = event.target.value;
        setSelectedItemKey(selectedKey);

        const fullItem = itemsList?.find(item => item.key === selectedKey) || null;
        setSelectedItemObject(fullItem);
        console.log("Selected Item Key:", selectedKey);
        console.log("Selected Item Object:", fullItem);
    };


    function setYes(){
        setRecurring(true);
        setButton(true);
    }

    function setNo(){
        setRecurring(false);
        setButton(true);
    }

    function setSavings()
    {
        const today = new Date();
    
        var data = localStorage.getItem('user_data');
        var parsedData = data ? JSON.parse(data) : null;
    
        let savings = new Array<Item>();

        var length = '0';

        if(parsedData.User.Savings != undefined)
        {
            for(var i = 0; i < parsedData.User.Savings.length; i++) 
            {
                var counter = parsedData.User.Savings[i];

                // Ensures item is not in the future
                if(counter.InitialTime != undefined)
                {
                    let old = new Date(Date.UTC(counter.InitialTime.Year, counter.InitialTime.Month - 1, counter.InitialTime.Day));
                    if((today.getTime() - old.getTime()) < 0)
                        continue;
                }

                let newItem: Item = 
                {
                    key: i.toString(),
                    Name: counter.Name, 
                    Date: counter.InitialTime != undefined ? counter.InitialTime : {"Month":1, "Day":1, "Year":2023},
                    Amount: counter.Amount,
                    APR: counter.APR,
                };

                savings.push(newItem);
            }

            length = parsedData.User.Savings.length.toString();
        }
        // Add "account" for when going to cash
        let newItem: Item = 
        {
            key: length,
            Name: "Untracked", 
            Date: {"Month":1, "Day":1, "Year":2023},
            Amount: 0,
            APR: 0,
        };
    
        savings.push(newItem);

        return savings;
    }


    async function addFunds(item: Item | null, amount : any) 
    {
        if(item == null)
            return;

        if(item.Name == "Untracked")
            return;


        const token = localStorage.getItem('token');

        var index = parseInt(item.key);

        var obj = 
        {
            index: index,
            NewName: item.Name,
            NewAmount: item.Amount + amount, // Only thing updated here
            NewAPR: item.APR,
            NewInitialTime: item.Date
        };

        console.log(obj);
        var js = JSON.stringify(obj);

        try 
        {
            const response = await fetch('http://salvagefinancial.xyz:5000/api/EditSaving',
                { method:'POST', body:js, headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            var res = JSON.parse(await response.text());

            if (res.Result === "Edited saving of user") 
            {
                console.log("edited\n");
                await updateInfo();
                //triggerRerender(); // Ensure parent knows data changed
            } 
            else 
            {
                console.error("Edit failed:", res.Result);
                // Consider adding user feedback here
            }
        } 
        catch (error: any) 
        {
            alert(error.toString());
        }
    }

    function addIncomeWrapper(event : any)
    {
        const valAmount = (document.getElementById("IncNum") as HTMLInputElement).value;
        const userName = (document.getElementById("IncNames") as HTMLInputElement).value;
        const date = (document.getElementById("Incdate") as HTMLInputElement).value;
        const alertMessage = document.getElementById("alertmessage");

        if (alertMessage) {
            if (date.length == 0 || userName.length == 0 || valAmount.length == 0 || isButtonClicked == false || selectedItemKey == ''){
                alertMessage.innerText = "Please Complete all the fields";
                alertMessage.style.color = "#ff6384";
                alertMessage.style.visibility = "visible";
                return;
            } 
        }
        
       
        const IfRecurring = isRecurring;
        const [month, day, year] = date.split("/");


        if(IfRecurring)
        {
            var i = parseInt(month) - 1;

            for(i = i; i < 12; i++)
            {
                (document.getElementById("Incdate") as HTMLInputElement).value = (i + 1).toString() + "/" + day + "/" + year;
                addIncome(event);
            }  
        }
        else
            addIncome(event);

    }

    async function addIncome(event: any): Promise<void>{

        const valAmount = (document.getElementById("IncNum") as HTMLInputElement).value;
        const userName = (document.getElementById("IncNames") as HTMLInputElement).value;
        const date = (document.getElementById("Incdate") as HTMLInputElement).value;
        const alertMessage = document.getElementById("alertmessage");

        if (alertMessage) {
            if (date.length == 0 || userName.length == 0 || valAmount.length == 0 || isButtonClicked == false || selectedItemKey == ''){
                alertMessage.innerText = "Please Complete all the fields";
                alertMessage.style.color = "#ff6384";
                alertMessage.style.visibility = "visible";
                return;
            } 
        }
        
       
        const token = localStorage.getItem('token');

        
        
        const Amount = parseFloat(valAmount);
        const IfRecurring = isRecurring;
        const [month, day, year] = date.split("/");
        const InitialTime = {Month: parseInt(month), Day: parseInt(day), Year: parseInt(year)};

        event.preventDefault();
        var obj = {Name: userName, Amount: Amount, Account:selectedItemObject?.Name,IfRecurring: IfRecurring, InitialTime: InitialTime};
        var js = JSON.stringify(obj);

        try {
            const response = await fetch('http://salvagefinancial.xyz:5000/api/AddIncome',
            {method:'POST',body:js,headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            var res = JSON.parse(await response.text());

            
            if (res.Result == "Could not add income"){
                
                if (alertMessage){
                    alertMessage.innerText = "Unsuccesfully Added";
                    alertMessage.style.color = "#ff6384";
                    alertMessage.style.visibility = "visible";
                }

            } else if (res.Result == "Could not find user to add income"){
                
                if (alertMessage) {
                    alertMessage.innerText = "Unsuccesfully Added";
                    alertMessage.style.color = "#ff6384";
                    alertMessage.style.visibility = "visible";
                }

            } else if (res.Result == "Added income to user"){

                
                if (alertMessage){

                    (document.getElementById("IncNames") as HTMLInputElement).value = "";
                    (document.getElementById("IncNum") as HTMLInputElement).value = "";
                    setSelectedItemKey("");

                    alertMessage.innerText = "Succesfully Added";
                    alertMessage.style.color = "#00c04b";
                    alertMessage.style.visibility = "visible";

                    addFunds(selectedItemObject, Amount);
                    await updateInfo();
                    triggerRerender();
                }

            } else {

                if (alertMessage) {
                    alertMessage.innerText = "Unsuccesfully Added";
                    alertMessage.style.color = "#ff6384";
                    alertMessage.style.visibility = "visible";
                }

            }

            

        } catch (error: any){
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

        <div id = "finances">
            <div id = "income">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[3vh] text-[#ffffff]">Add Income</span>
                </div>

                <h5 className="self-start ml-[10%] text-white text-lg text-left text-[0.95rem]">Name</h5>
                <input className="h-1/2 w-8/10 text-white text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type="text" placeholder = "Name" id = "IncNames" onKeyUp={(e) => {
                    if (e.key === "Enter") 
                    {
                      var next = document.getElementById("IncNum") as HTMLInputElement;
                      next.focus();
                    }
                  }}></input>

                <br></br>
                
                <h5 className="self-start ml-[10%] text-white text-lg text-left text-[0.95rem]">Amount</h5>
                <input className="h-1/2 w-8/10 text-lg text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" type="text" placeholder = "Amount" id = "IncNum" onKeyUp={(e) => {
                    if (e.key === "Enter") 
                    {
                      var next = document.getElementById("Incdate") as HTMLInputElement;
                      next.focus();
                    }
                  }}></input>

                <br></br>
                

                <h5 className="self-start ml-[10%] text-white text-lg text-left text-[0.95rem]">Date</h5>
                <input className="h-1/2 w-8/10 text-lg text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" defaultValue={(otoday.getMonth() + 1) + "/" + otoday.getDate() + "/" + otoday.getFullYear()} type="text" placeholder = "MM/DD/YYYY" id = "Incdate" onKeyUp={(e) => {
                    if (e.key === "Enter") 
                    {
                      var next = document.getElementById("Incaccount") as HTMLInputElement;
                      next.focus();
                    }
                  }}></input>

                <h5 className="self-start ml-[10%] text-white text-lg text-left text-[0.95rem]">Account</h5>

                <select
                    id="Incaccount"
                    value={selectedItemKey} // Controlled component: value linked to state
                    onChange={handleItemChange} // Update state on change
                    className="h-[1/2] w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1"
                    required
                    >

                    {/* Placeholder Option */}
                    <option className="text-black bg-[#7f8fb5]" value="" disabled>
                      Select Account
                    </option>

                    {itemsList.map((item) => (
                      <option className="text-black bg-[#7f8fb5]"
                        key={item.key}
                        value={item.key}
                      >
                        {item.Name} {/* Display the item's Name to the user */}
                      </option>
                    ))}
                </select>

                <div className="flex items-center text-white justify-between ml-[10%] mt-2 w-8/10">
                    <h5 className="self-start text-lg text-left text-[0.95rem]">Is The Income Recurring?</h5> 
                    <div>
                        <label>
                            <input type="radio" name="radio" onClick = {setYes}></input>
                        Yes </label>
                        

                        <label>
                            <input type="radio" name="radio" onClick = {setNo}></input>
                        No </label>  
                    </div>
                </div>

                <div className="fixed top-[85%] w-[100%] flex items-center justify-between">
                    <h5 className="ml-[10%] text-[#ff6384]" id="alertmessage"></h5>
                    <button id = "AddIncome" className = "rounded-sm inline-block h-fit w-fit mr-[10%] p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {addIncomeWrapper} >Add Income</button>
                </div>
            </div>
            
        </div>

    );
}


export default AddIncome;