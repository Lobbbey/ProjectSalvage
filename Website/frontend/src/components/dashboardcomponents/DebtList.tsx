import * as React from "react";
import { useNavigate } from 'react-router-dom';

interface Item 
{
    key:string;
    Name: string;
    Date: any;
    Amount: any,
    Monthly: any;
    APR: any;
}

interface PropsType 
{
    items: Item[];
    renderer: (item: Item) => React.ReactNode;
}


function setDebt()
{
    const today = new Date();

    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    let expenses = new Array<Item>();

    for (var i = 0; i < parsedData.User.Debts.length; i++) 
    {
        var counter = parsedData.User.Debts[i];

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
            Amount: counter.Amount,
            Monthly: counter.Monthly,
            APR: counter.APR
        };

        expenses.push(newItem);
    }
    
    expenses.sort((a, b) => a.Amount == b.Amount ? Date.UTC(b.Date.Year, b.Date.Month - 1, b.Date.Day) 
    - Date.UTC(a.Date.Year, a.Date.Month - 1, a.Date.Day) : b.Amount - a.Amount);

    return expenses.slice(0, 20); // Return most recent 10 items
}

const renderExpenseItem = (item: Item): React.ReactNode => 
{

    return (
        <div>
            <div className="flex justify-between items-center">
                <span className="text-white font-semibold text-md">${item.Amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className="text-gray-300 text-xs">{item.APR.toFixed(2)}% APR</span>
            </div>
            <p className="self-start text-white">{item.Name}, ${item.Monthly.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} / Mo</p>
        </div>
    );
};

function DebtList() 
{
    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    const navigate = useNavigate();

    if(parsedData.User.Debts == undefined || parsedData.User.Debts.length == 0)
    {
        return(
            <div className="text-white m-5">
                <p className="m-2">🥳 Congratulations! No debts to display. 🎉</p>
                <p className="mt-5 mb-5">When you signed up, you had ${parsedData.User.InitialDebt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} of debt.</p>
                <p className="inline">(If you haven't added your debts yet in the </p>
                <p className="inline underline text-[#6d91e8] cursor-pointer" onClick={navDebt}>debt pane</p>
                <p className="inline">, you should)</p>
            </div>
        );
    }

    

    var props: PropsType = {
        items: setDebt(),
        renderer: renderExpenseItem
    };

    function navDebt()
    {
        navigate('/debt');
    }

    return (
        <ul className="shadow divide-y divide-[#7f8fb5] min-h-0">
        {props.items.map((item) => {
            return <li onClick={navDebt} className="px-[1vw] py-[1vh] cursor-pointer border-b border-[#7f8fb5]">{props.renderer(item)}</li>;
        })}
        </ul>
    );
}

export default DebtList;