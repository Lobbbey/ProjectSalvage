var totalSavings = 0;
var totalIncome = 0, totalExpenses = 0;

function calcSavings(parsedData:any)
{
    totalSavings = 0;

    if(parsedData.User.Savings == undefined || parsedData.User.Savings.length == 0) 
        return;

    const today = new Date();

    for (var i = 0; i < parsedData.User.Savings.length; i++) 
    {
        var counter = parsedData.User.Savings[i];

        // Ensures item is not in the future
        if(counter.InitialTime != undefined)
        {
            let old = new Date(Date.UTC(counter.InitialTime.Year, counter.InitialTime.Month - 1, counter.InitialTime.Day));
            if((today.getTime() - old.getTime()) < 0)
                continue;
        }

        totalSavings += counter.Amount;
    }
}

function calcIncome(parsedData:any)
{
    totalIncome = 0;

    if(parsedData.User.Income == undefined || parsedData.User.Income.length == 0) 
        return;

    const today = new Date();

    for (var i = 0; i < parsedData.User.Income.length; i++) 
    {
        var counter = parsedData.User.Income[i];

        // Ensures item is not in the future
        if(counter.InitialTime != undefined)
        {
            let old = new Date(Date.UTC(counter.InitialTime.Year, counter.InitialTime.Month - 1, counter.InitialTime.Day));
            if((today.getTime() - old.getTime()) < 0)
                continue;

            if(today.getMonth() + 1 != counter.InitialTime.Month)
                continue;
        }

        totalIncome += counter.Amount;
    }
}

function calcExpenses(parsedData:any)
{
    totalExpenses = 0;

    if(parsedData.User.Expenses == undefined || parsedData.User.Expenses.length == 0) 
        return;

    const today = new Date();

    for (var i = 0; i < parsedData.User.Expenses.length; i++) 
    {
        var counter = parsedData.User.Expenses[i];

        // Ensures item is not in the future
        if(counter.InitialTime != undefined)
        {
            let old = new Date(Date.UTC(counter.InitialTime.Year, counter.InitialTime.Month - 1, counter.InitialTime.Day));
            if((today.getTime() - old.getTime()) < 0)
                continue;

            if(today.getMonth() + 1 != counter.InitialTime.Month)
                continue;
        }

        totalExpenses += counter.Amount;
    }
}



function StatList() 
{
    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    if(parsedData.User.Savings == undefined || parsedData.User.Savings.length == 0) 
        return(
            <div>
                <ul className="shadow divide-y divide-[#7f8fb5] min-h-0 border-b border-[#6d91e8]">
                <li className="px-[1vw] py-[1vh] group">
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-white font-semibold text-3xl">Total Funds:</span>
                            <span className="font-semibold text-3xl text-[#ff6384]">$0.00</span>
                        </div>
                    </div>
                </li>
                </ul>
            </div>
    );


    calcSavings(parsedData);
    calcIncome(parsedData);
    calcExpenses(parsedData);

    return (
        <ul className="shadow divide-y divide-[#7f8fb5] min-h-0 border-b border-[#6d91e8]">
            <li className="px-[1vw] py-[1vh] group">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-3xl">Total Funds:</span>
                        <span className="font-semibold text-3xl" style = {{color: (totalSavings != 0) ? '#36eba6' :'#ff6384'}}> ${totalSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                </div>
            </li>

            <li className="px-[1vw] py-[1vh] group">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Number of Accounts:</span>
                        <span className="font-semibold text-md" style = {{color: '#36eba6'}}>{parsedData.User.Savings.length}</span>
                    </div>
                   
                </div>
            </li>

            
        </ul>
    );
}

export default StatList;