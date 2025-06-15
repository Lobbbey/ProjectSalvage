
import * as React from "react";
import {useState} from "react";


interface Item 
{
    key:string;
    Name: string;
    Date: any;
    Amount: any;
    APR: any;
}

interface PropsType 
{
    items: Item[];
    renderer: (item: Item) => React.ReactNode;
}

interface ChildProps 
{
    triggerRerender: () => void;
}


const SavingsList: React.FC<ChildProps> = ({ triggerRerender }) =>
{
    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [deletingItem, setDeletingItem] = useState<Item | null>(null);
    const [addFundsItem, setaddFundsItem] = useState<Item | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleEditClick = (item: Item) => 
    {
        setDeletingItem(null);
        setaddFundsItem(null);
        setEditingItem(item);
    };

    const handleDeleteClick = (item: Item) => 
    {
        setEditingItem(null);
        setaddFundsItem(null);
        setDeletingItem(item);
    };

    const handleAddFundsClick = (item: Item) => 
    {
        setEditingItem(null);
        setDeletingItem(null);
        setaddFundsItem(item);
    };

    const handleCancel = () => 
    {
        setEditingItem(null);
        setDeletingItem(null);
        setaddFundsItem(null);
    };
    
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
    
    const renderDebtItem = (item: Item): React.ReactNode => 
    {
        return (
            <div>
                <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-md">${item.Amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <span className="text-gray-300 text-xs">{item.APR.toFixed(2)}% APR</span>
                </div >
    
                <div className="flex justify-between items-center my-[1vh]">
                    <p className="text-white">{item.Name}</p>
                    <div className="flex">
                        <button className = "rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2] cursor-pointer" onClick = {()=> handleAddFundsClick(item)}> Add Funds </button>
                        <button className = "ml-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2] cursor-pointer" onClick = {()=> handleEditClick(item)}>Edit </button>
                        <button className = "ml-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {() => handleDeleteClick(item)}>Delete</button>
                    </div>
                </div>   
            </div>
        );
    };
    
    async function deleteSavings(item: Item) : Promise<void>
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
            const response = await fetch('http://salvagefinancial.xyz:5000/api/DeleteSaving',
            {method:'POST',body:js,headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            var res = JSON.parse(await response.text());
    
            if (res.Result == "Deleted saving from user") {
    
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
    
    async function editSavings(item: Item, dateStr: string) 
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
            NewInitialTime: NewInitialTime
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
    
    async function addFunds(item: Item) 
    {
        const token = localStorage.getItem('token');

        var index = parseInt(item.key);

        var obj = 
        {
            index: index,
            NewName: item.Name,
            NewAmount: item.Amount, // Only thing updated here
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
    

    if(parsedData.User.Savings == undefined || parsedData.User.Savings.length == 0)
    {
        return(
            <div id = "ExpRes">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[3vh] text-[#ffffff]"> Your Accounts</span>
                </div>

                <div className="text-white p-5">
                    <p className="mt-5">No accounts to display.</p>
                </div>
            </div>
        );
    }

    var props: PropsType = 
    {
        items: setSavings(),
        renderer: renderDebtItem
    };

    return(

        <div id = "ExpRes" className="flex flex-col h-full">
            <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[3vh] text-[#ffffff]">Your Accounts</span>
            </div>

            {!editingItem && !deletingItem && !addFundsItem && (
                <div className = "flex flex-col flex-grow min-h-0">

                    <br></br>

                    <div className = "flex w-[100%] relative items-center">
                        <input type="text" placeholder="Search..."  className="w-8/10 text-md ml-[10%] rounded-sm border border-[#6d91e8] relative bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
                    </div>

                    <br></br>

                    <ul className="flex-grow overflow-y-auto shadow divide-y divide-[#7f8fb5]" id = "listss">
                        {props.items.filter((item) => item.Name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => {
                            if(item.Name != "Untracked")
                                return <li key={item.key} className="px-[1vw] py-[1vh] hover:bg-white/5">{props.renderer(item)}</li>;
                        })}
                    </ul>


                </div>
             )}

            {/* Edit Modal */}
            {editingItem && (
                <EditModal
                    item={editingItem}
                    onSave={editSavings}
                    onCancel={handleCancel}
                />
            )}

            {/* Delete Modal */}
            {deletingItem && (
               <DeleteModal
                   item={deletingItem}
                   onConfirm={deleteSavings}
                   onCancel={handleCancel}
               />
            )}

            {/* Add Funds Modal */}
            {addFundsItem && (
               <AddFundsModal
                   item={addFundsItem}
                   onConfirm={addFunds}
                   onCancel={handleCancel}
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

interface AddFundsModalProps extends ModalProps 
{
    onConfirm: (item: Item) => Promise<void>;
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


    const handleSaveClick = () => 
    {   
            const alertMessage = document.getElementById("alertMessagess");
            
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

            if (alertMessage){
                alertMessage.innerText = "";
                alertMessage.style.visibility = "hidden"; 
            }
    
            // Create an updated item object to pass to the save function
            const updatedItem: Item = 
            {
                ...item, 
                Name: name,
                Amount: parsedAmount,
                APR: parsedAPR,
            };
            
            
            onSave(updatedItem, date);
    };

    return (
        <div>
            <h5 className="self-start text-white ml-[10%] text-lg text-left text-[0.95rem]">Name</h5>
            <input className="h-6 w-8/10 text-white text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={name} onChange={(e) => setName(e.target.value)} placeholder = {item.Name} id = "Expname2" onKeyUp={(e) => {
                if (e.key === "Enter") 
                {
                  var next = document.getElementById("Savingsnum") as HTMLInputElement;
                  next.focus();
                }
              }}/>       
                
            <h5 className="self-start text-white ml-[10%] text-lg text-left text-[0.95rem]">Amount</h5>
            <input type="number" className="h-6 w-8/10 text-white text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder = {typeof item.Amount === 'number' ? item.Amount.toString() : 'Amount'} id = "Savingsnum" onKeyUp={(e) => {
                if (e.key === "Enter") 
                {
                  var next = document.getElementById("savingsdate") as HTMLInputElement;
                  next.focus();
                }
              }}/>
                   
    
            <h5 className="self-start ml-[10%] text-white text-lg text-left text-[0.95rem]">Date</h5>
            <input className="h-6 w-8/10 text-lg text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={date} onChange={(e) => setDate(e.target.value)} placeholder = {dateStr || 'MM/DD/YYYY'} id = "savingsdate" onKeyUp={(e) => {
                if (e.key === "Enter") 
                {
                  var next = document.getElementById("savingsapr") as HTMLInputElement;
                  next.focus();
                }
              }}/>
    
            <h5 className="self-start ml-[10%] text-white text-lg text-left text-[0.95rem]">Interest Rate (APR)</h5>
            <input className="h-6 w-8/10 text-lg text-white rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" value={apr} onChange={(e) => setApr(e.target.value)} placeholder = {item.APR} id = "savingsapr"/>
            
            <h5 className="mt-3 text-[#ff6384]" id = "alertMessagess"></h5>

            <button id = "EditIncome" className = "fixed left-[29%] top-[87%] rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick ={handleSaveClick}>Edit Account</button>
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
            
            <h5 className="text-lg text-center">APR: {item.APR}</h5>
        
            <div className="fixed top-[80%] left-3/10  w-4/10 flex items-center justify-center">
                <button className = "mr-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#ff6384] text-center text-[1.8vh] hover:bg-red-400/50 hover:border-[#fc3030]" onClick = {() => onConfirm(item)}> Delete</button>
                <button className = "ml-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {onCancel}> Cancel</button>
            </div>
        </div>
    );
};

const AddFundsModal: React.FC<AddFundsModalProps> = ({ item, onConfirm, onCancel }) => 
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

        parsedAmount = item.Amount + parsedAmount;
        // Create an updated item object to pass to the save function
        const updatedItem: Item = 
        {
            ...item, 
            Name: item.Name,
            Amount: parsedAmount,
            APR: item.APR,
        };
        
        
        onConfirm(updatedItem);
    };

    return (
        <div>
            <div className="flex-col mt-2 h-[10%] items-center justify-center">
                <span id = "visualTitle" className = "font-[Lucida Sans] font-bold text-[2.5vh] text-[#ffffff]">Deposit Money</span>
            </div>

            <h5 className="self-start ml-[10%] mt-10 text-lg text-left text-[0.95rem]">Amount</h5>
            <input type="number" className="h-6 w-8/10 text-lg rounded-sm border border-[#6d91e8] bg-blue-400/5 focus:outline-none focus:ring-1 focus:ring-[#7f8fb5] p-1" onChange={(e) => setAmount(e.target.value)} placeholder = {'Amount'} id = "Savings num"/>

            <div className="fixed top-[80%] left-3/10  w-4/10 flex items-center justify-center">
                <button className = "mr-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#36eba6] text-center text-[1.8vh] hover:bg-green-400/50 hover:border-[#1df25d]" onClick = {handleSaveClick}>Deposit</button>
                <button className = "ml-2 rounded-sm inline-block h-fit w-fit p-[10px] pt-[5px] pb-[7px] bg-transparent border border-[#6d91e8] text-center text-[1.8vh] hover:bg-blue-400/15 hover:border-[#bdc8e2]" onClick = {onCancel}> Cancel</button>
            </div>
        </div>
    );
};

export default SavingsList;