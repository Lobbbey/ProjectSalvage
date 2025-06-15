import * as React from "react";
import { useNavigate } from 'react-router-dom';

interface Item 
{
    key:string;
    Name: string;
    Date: any;
    Amount: any;
}

interface PropsType 
{
    items: Item[];
    renderer: (item: Item) => React.ReactNode;
}

function setExpenses()
{
    const today = new Date();

    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    let expenses = new Array<Item>();

    for(var i = 0; i < parsedData.User.Expenses.length; i++) 
    {
        var counter = parsedData.User.Expenses[i];

        // Ensures item is not in the future
        if(counter.InitialTime != undefined)
        {
            let old = new Date(Date.UTC(counter.InitialTime.Year, counter.InitialTime.Month - 1, counter.InitialTime.Day));
            if((today.getTime() - old.getTime()) < 0)
                continue;
        }

        let newItem: Item = {
            key: i.toString(),
            Name: counter.Name, 
            Date: counter.InitialTime != undefined ? counter.InitialTime : {"Month":1, "Day":1, "Year":2023},
            Amount: counter.Amount
        };

        expenses.push(newItem);
    }
    
    expenses.sort((a, b) => Date.UTC(b.Date.Year, b.Date.Month - 1, b.Date.Day) 
    - Date.UTC(a.Date.Year, a.Date.Month - 1, a.Date.Day));

    return expenses.slice(0, 20); // Return most recent 10 items
}

const renderExpenseItem = (item: Item): React.ReactNode => 
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
            </div>
            <p className="self-start text-white">{item.Name}</p>
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


function ExpensesList() 
{
    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    if(parsedData.User.Expenses == undefined || parsedData.User.Expenses.length == 0)
    {
        return(
            <div className="text-white p-5">
                <p className="mt-5">Looks like you haven't spent anything yet! No expenses to display.</p>
            </div>
        );
    }

    const navigate = useNavigate();

    var props: PropsType = {
        items: setExpenses(),
        renderer: renderExpenseItem
    };

    function navFinancials()
    {
        navigate('/financials');
    }

    return (
        <ul className="shadow divide-y divide-[#7f8fb5] min-h-0">
        {props.items.map((item) => {
            return <li onClick={navFinancials} className="px-[1vw] py-[1vh] cursor-pointer border-b border-[#7f8fb5]">{props.renderer(item)}</li>;
        })}
        </ul>
    );
}

export default ExpensesList;