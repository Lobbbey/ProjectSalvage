
import * as React from "react";
import {useState} from "react";


interface Item 
{
    key:string;
    Name: string;
    Date: any;
    Amount: any;
    APR: any;
    Term: any;
    Monthly: any;
}

interface PropsType 
{
    items: Item[];
    renderer: (item: Item) => React.ReactNode;
}

interface ChildProps 
{
    triggerRerender: () => void;
    doConfetti: () => Promise<void>;
}


const DebtList: React.FC<ChildProps> = ({ triggerRerender, doConfetti }) =>
{
    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [deletingItem, setDeletingItem] = useState<Item | null>(null);
    const [payoffItem, setPayoffItem] = useState<Item | null>(null);

    const handleEditClick = (item: Item) => 
    {
        setDeletingItem(null);
        setPayoffItem(null);
        setEditingItem(item);
    };

    const handleDeleteClick = (item: Item) => 
    {
        setEditingItem(null);
        setPayoffItem(null);
        setDeletingItem(item);
    };

    const handlePayoffClick = (item: Item) => 
    {
        setEditingItem(null);
        setDeletingItem(null);
        setPayoffItem(item);
    };

    const handleCancel = () => 
    {
        setEditingItem(null);
        setDeletingItem(null);
        setPayoffItem(null);
    };

    const triggerConfetti = async () => 
    {
        doConfetti();
    };
    
    function setDebts()
    {
        const today = new Date();
    
        var data = localStorage.getItem('user_data');
        var parsedData = data ? JSON.parse(data) : null;
    
        let debts = new Array<Item>();
    
        for(var i = 0; i < parsedData.User.Debts.length; i++) 
        {
            var counter = parsedData.User.Debts[i];
    
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
                Term: counter.LoanLength,
                Monthly: counter.Monthly
            };
    
            debts.push(newItem);
        }
        
        debts.sort((a, b) => a.Amount == b.Amount ? Date.UTC(b.Date.Year, b.Date.Month - 1, b.Date.Day) 
        - Date.UTC(a.Date.Year, a.Date.Month - 1, a.Date.Day) : b.Amount - a.Amount);
    
        return debts; // Return most recent 10 items
    }
    
    const renderDebtItem = (item: Item): React.ReactNode => 
    {
        const today = new Date();
    
        var months = [ "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December" ];
    
        let old = new Date(Date.UTC(item.Date.Year, item.Date.Month - 1, item.Date.Day));
        let daysago = Math.floor((today.getTime() - old.getTime()) / 86400000);
    
        return (
            <div>
                <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-md">${item.Amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <span className="text-gray-300 text-xs"> {daysago == 0 ? "Today" : 
                    daysago > 30 ? months[item.Date.Month - 1] + " " + item.Date.Day + GetDaySuffix(item.Date.Day): daysago + " Days Ago"}</span>
                </div >
    
                <div className="flex justify-between items-center my-[1vh]">
                    <p className="text-white">{item.Name}</p>
                    <div className="flex">
                        <button className = "rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2] cursor-pointer" onClick = {()=> handlePayoffClick(item)}> Payoff </button>
                        <button className = "ml-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2] cursor-pointer" onClick = {()=> handleEditClick(item)}>Edit </button>
                        <button className = "ml-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {() => handleDeleteClick(item)}>Delete</button>
                    </div>
                </div>   
            </div>
        );
    };
    
    function GetDaySuffix(day:any)
    {
        switch (day)
        {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    }
    
    async function deleteDebt(item: Item) : Promise<void>
    {
        var data = localStorage.getItem('user_data');
        var parsedData = data ? JSON.parse(data) : null;
        console.log(parsedData);
        const token = localStorage.getItem('token');
    
        var index = 0;
    
        index = parseInt(item.key);
        
        console.log("The index you are deleting is " + index);
    
        var obj = {index: index};
        var js = JSON.stringify(obj);
        
        try 
        {
            const response = await fetch('http://salvagefinancial.xyz:5000/api/DeleteDebt',
            {method:'POST',body:js,headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            var res = JSON.parse(await response.text());
    
            if (res.Result == "Deleted debt from user") {
    
                await setInfo();
                console.log("Deleted " + index);
                triggerRerender();
                handleCancel();
                return;
            } 
            else
            {
                console.log(res.Result);
                return;
            }
        } 
        catch (error: any)
        {
            alert(error.toString());
            return;
        }
    }
    
    async function editDebt(item: Item, dateStr: string) 
    {
        const token = localStorage.getItem('token');

        var index = parseInt(item.key);

        // Values are passed directly from EditModal state now
        const NewInitialTime = { Month: parseInt(dateStr.split("/")[0]), Day: parseInt(dateStr.split("/")[1]), Year: parseInt(dateStr.split("/")[2]) };

        var obj = 
        {
            index: index,
            NewName: item.Name, // Already updated in EditModal state
            NewAmount: item.Amount, // Already updated in EditModal state
            NewAPR: item.APR, // Already updated in EditModal state
            NewMonthly: item.Monthly,
            NewLoanLength: item.Term,
            NewInitialTime: NewInitialTime
        };

        console.log(obj);
        var js = JSON.stringify(obj);

        try 
        {
            const response = await fetch('http://salvagefinancial.xyz:5000/api/EditDebt',
                { method:'POST', body:js, headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            var res = JSON.parse(await response.text());

            if (res.Result === "Edited debt of user") 
            {
                console.log("edited\n");
                await setInfo();
                triggerRerender(); // Ensure parent knows data changed
                handleCancel(); // Close modal
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
    
    async function payoffDebt(item: Item) 
    {
        const token = localStorage.getItem('token');

        var index = parseInt(item.key);

        var obj = 
        {
            index: index,
            NewName: item.Name,
            NewAmount: item.Amount, // Only thing updated here
            NewAPR: item.APR,
            NewMonthly: item.Monthly,
            NewLoanLength: item.Term,
            NewInitialTime: item.Date
        };

        console.log(obj);
        var js = JSON.stringify(obj);

        try 
        {
            const response = await fetch('http://salvagefinancial.xyz:5000/api/EditDebt',
                { method:'POST', body:js, headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            var res = JSON.parse(await response.text());

            if (res.Result === "Edited debt of user") 
            {
                console.log("edited\n");
                await setInfo();
                triggerRerender(); // Ensure parent knows data changed
                handleCancel(); // Close modal
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

    async function setInfo() : Promise<void>
    {
        
        console.log(localStorage.getItem('token'));
        
        try
        {
          const response = await fetch('http://salvagefinancial.xyz:5000/api/ShowAllInfo',
          {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`}});
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
    

    if(parsedData.User.Debts == undefined || parsedData.User.Debts.length == 0)
    {
        return(
            <div id = "ExpRes">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[3vh] text-[#ffffff]"> Your Expenses</span>
                </div>

                <div className="text-white p-5">
                    <p className="mt-5">No debts to display.</p>
                </div>
            </div>
        );
    }

    var props: PropsType = 
    {
        items: setDebts(),
        renderer: renderDebtItem
    };

    return(

        <div id = "ExpRes" className="flex flex-col h-full">
            <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[3vh] text-[#ffffff]">Your Debts</span>
            </div>

            {!editingItem && !deletingItem && !payoffItem && (
                <div className = "flex flex-col flex-grow min-h-0">
                    <ul className="flex-grow overflow-y-auto shadow divide-y divide-[#7f8fb5] border-b border-[#6d91e8] px-4 py-2" id = "listss">
                        {props.items.map((item) => {
                        return <li key={item.key} className="px-[1vw] py-[1vh] hover:bg-white/5">{props.renderer(item)}</li>;
                        })}
                    </ul>
                </div>
             )}

            {/* Edit Modal */}
            {editingItem && (
                <EditModal
                    item={editingItem}
                    onSave={editDebt}
                    onCancel={handleCancel}
                />
            )}

            {/* Delete Modal */}
            {deletingItem && (
               <DeleteModal
                   item={deletingItem}
                   onConfirm={deleteDebt}
                   onCancel={handleCancel}
               />
            )}

            {/* Delete Modal */}
            {payoffItem && (
               <PayoffModal
                   item={payoffItem}
                   onConfirm={payoffDebt}
                   onCancel={handleCancel}
                   onDelete={deleteDebt}
                   onConfetti={triggerConfetti}
               />
            )}

        </div>

    );
}


// Modal components
interface ModalProps 
{
    item: Item;
    onCancel: () => void;
}

interface EditModalProps extends ModalProps 
{
    onSave: (item: Item, dateStr: string) => Promise<void>;
}

interface DeleteModalProps extends ModalProps 
{
    onConfirm: (item: Item) => Promise<void>;
}

interface PayoffModalProps extends ModalProps 
{
    onConfirm: (item: Item) => Promise<void>;
    onDelete: (item: Item) => Promise<void>;
    onConfetti: () => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({ item, onSave, onCancel }) => 
{
    // Use state for form inputs
    const [name, setName] = useState(item.Name);
    
    // Ensure amount is treated as string for input, handle potential non-numeric original value
    const [amount, setAmount] = useState(typeof item.Amount === 'number' ? item.Amount.toString() : '');
    
    // Ensure date components are valid before creating string
    const dateStr = !isNaN(item.Date.Month) && !isNaN(item.Date.Day) && !isNaN(item.Date.Year)
       ? `${item.Date.Month}/${item.Date.Day}/${item.Date.Year}`
       : '';

    const [date, setDate] = useState(dateStr);
    const [apr, setApr] = useState(item.APR);
    const [term, setTerm] = useState(item.Term);
    const [monthly, setMonthly] = useState(item.Monthly);

    const handleSaveClick = () => 
    {   
            const alertMessage = document.getElementById("alertMessagess");
            const parsedMonthly = parseFloat(monthly);
            if (isNaN(parsedMonthly) && alertMessage) 
            {
                alertMessage.innerText = "Please enter a valid monthly payment.";
                alertMessage.style.visibility = "visible"; 
                return;
            }
            
            // Validate inputs (e.g., date format, amount is number) before saving
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) && alertMessage) 
            {
                alertMessage.innerText = "Please enter a valid amount.";
                alertMessage.style.visibility = "visible"; 
                return;
            }
    
            // Basic date format check (MM/DD/YYYY)
            if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date) && alertMessage) 
            {
                alertMessage.innerText = "Please enter the date in MM/DD/YYYY format.";
                alertMessage.style.visibility = "visible"; 
                return;
            }
            
            const parsedAPR = parseFloat(apr);
            if (isNaN(parsedAPR) && alertMessage) 
            {
                alertMessage.innerText = "Please enter a valid APR.";
                alertMessage.style.visibility = "visible"; 
                return;
            }

            const parsedTerm = parseFloat(term);
            if (isNaN(parsedTerm) && alertMessage) 
            {
                alertMessage.innerText = "Please enter a valid term.";
                alertMessage.style.visibility = "visible"; 
                return;
            }

            if (alertMessage){
                alertMessage.innerText = "";
                alertMessage.style.visibility = "hidden"; 
            }

            setMonthly(1); // This doesn't do anything
    
            // Create an updated item object to pass to the save function
            const updatedItem: Item = 
            {
                ...item, 
                Name: name,
                Amount: parsedAmount,
                APR: parsedAPR,
                Term: parsedTerm,
                Monthly: monthly, /* replace with equation to determine monthly payment */
            };
            
            
            onSave(updatedItem, date);
    };

    return (
        <div>
            <h5 className="self-start ml-[10%] text-lg text-left text-[0.95rem]">Name</h5>
            <input className="h-6 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={name} onChange={(e) => setName(e.target.value)} placeholder = {item.Name} id = "Expname2" onKeyUp={(e) => {
                if (e.key === "Enter") 
                {
                  var next = document.getElementById("Expnum2") as HTMLInputElement;
                  next.focus();
                }
              }}/>       
                
            <h5 className="self-start ml-[10%] text-lg text-left text-[0.95rem]">Amount</h5>
            <input type="number" className="h-6 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder = {typeof item.Amount === 'number' ? item.Amount.toString() : 'Amount'} id = "Expnum2" onKeyUp={(e) => {
                if (e.key === "Enter") 
                {
                  var next = document.getElementById("expdate2") as HTMLInputElement;
                  next.focus();
                }
              }}/>
                   
    
            <h5 className="self-start ml-[10%] text-lg text-left text-[0.95rem]">Date</h5>
            <input className="h-6 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={date} onChange={(e) => setDate(e.target.value)} placeholder = {dateStr || 'MM/DD/YYYY'} id = "expdate2" onKeyUp={(e) => {
                if (e.key === "Enter") 
                {
                  var next = document.getElementById("Expcat") as HTMLInputElement;
                  next.focus();
                }
              }}/>
    
            <h5 className="self-start ml-[10%] text-lg text-left text-[0.95rem]">Interest Rate (APR)</h5>
            <input className="h-6 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={apr} onChange={(e) => setApr(e.target.value)} placeholder = {item.APR} id = "Expcat"onKeyUp={(e) => {
                if (e.key === "Enter") 
                {
                  var next = document.getElementById("Expterm") as HTMLInputElement;
                  next.focus();
                }
              }}/>
              
            <h5 className="self-start ml-[10%] text-lg text-left text-[0.95rem]">Term (Months)</h5>
            <input className="h-6 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={term} onChange={(e) => setTerm(e.target.value)} placeholder = {item.Term} id = "Expterm"/>
            <h5 className="mt-4.5" id="alertMessagess"></h5>
    
            <button id = "EditIncome" className = "fixed left-[29%] top-[87%] rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick ={handleSaveClick}>Edit Expense</button>
            <button className = "fixed right-[31%] top-[87%] rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick ={onCancel}> Cancel</button>
        </div>
    );
};


const DeleteModal: React.FC<DeleteModalProps> = ({ item, onConfirm, onCancel }) => 
{
    // Ensure date components are valid before creating string
    const date = !isNaN(item.Date.Month) && !isNaN(item.Date.Day) && !isNaN(item.Date.Year)
       ? `${item.Date.Month}/${item.Date.Day}/${item.Date.Year}`
       : 'N/A'; // Fallback display

     // Ensure Amount is a number before displaying
    const amount = typeof item.Amount === 'number' ? item.Amount : 'N/A';

    return (
        <div className="flex flex-col">
            <div className="flex-col mt-2 h-[10%] items-center justify-center">
                <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[2.5vh] text-[#ffffff]"> Do you want to delete this Debt?</span>
            </div>
        
            <h5 className="text-lg text-center mt-10">Name:  {item.Name}</h5>

                    
            <h5 className="text-lg text-center">Amount: {amount}</h5>

            <h5 className="text-lg text-center">Date: {date}</h5>
            
            <h5 className="text-lg text-center">Monthly payment: {item.Monthly}</h5>
        
            <div className="fixed top-[80%] left-3/10  w-4/10 flex items-center justify-center">
                <button className = "mr-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#ff6384] text-center text-[1.8vh] hover:bg-red-400/50 hover:border-[#fc3030]" onClick = {() => onConfirm(item)}> Delete</button>
                <button className = "ml-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {onCancel}> Cancel</button>
            </div>
        </div>
    );
};

const PayoffModal: React.FC<PayoffModalProps> = ({ item, onConfirm, onCancel, onDelete, onConfetti }) => 
{  
    // Ensure amount is treated as string for input, handle potential non-numeric original value
    const [amount, setAmount] = useState(typeof item.Amount === 'number' ? item.Amount.toString() : '');
    
    const handleSaveClick = () => 
    {   
        const alertMessage = document.getElementById("alertMessagess");
        // Validate inputs (e.g., date format, amount is number) before saving
        var parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) && alertMessage) 
        {
            alertMessage.innerText = "Please enter a valid amount.";
            alertMessage.style.visibility = "visible"; 
            return;
        }
        
        var monthly = 10;
        
        if(parsedAmount >= item.Amount)
        {
            
            onDelete(item);
            onConfetti();
            return;
        }

        parsedAmount = item.Amount - parsedAmount;
        // Create an updated item object to pass to the save function
        const updatedItem: Item = 
        {
            ...item, 
            Name: item.Name,
            Amount: parsedAmount,
            APR: item.APR,
            Term: item.Term,
            Monthly: monthly, /* replace with equation to determine monthly payment */
        };
        
        
        onConfirm(updatedItem);
    };

    return (
        <div>
            <div className="flex-col mt-2 h-[10%] items-center justify-center">
                <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[2.5vh] text-[#ffffff]">Pay Down Debt</span>
            </div>

            <h5 className="self-start ml-[10%] mt-10 text-lg text-left text-[0.95rem]">Amount</h5>
            <input type="number" className="h-6 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" onChange={(e) => setAmount(e.target.value)} placeholder = {'Amount'} id = "Debtnum"/>

    
            <div className="fixed top-[80%] left-3/10  w-4/10 flex items-center justify-center">
                <button className = "mr-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#36eba6] text-center text-[1.8vh] hover:bg-green-400/50 hover:border-[#1df25d]" onClick = {handleSaveClick}>Pay</button>
                <button className = "ml-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {onCancel}> Cancel</button>
            </div>
        </div>
    );
};

export default DebtList;