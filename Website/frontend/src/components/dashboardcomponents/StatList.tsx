var totalDebt = 0.0, totalMinPayments = 0.0,
totalIncome = 0.0, totalExpenses = 0.0, 
totalSavings = 0.0, totalLastIncome = 0.0;

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


function calcDebt(parsedData:any)
{
    totalDebt = 0;
    totalMinPayments = 0;

    if(parsedData.User.Debts == undefined || parsedData.User.Debts.length == 0) 
        return;

    const today = new Date();

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

        totalDebt += counter.Amount;
        totalMinPayments += counter.Monthly;
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

function calcLastIncome(parsedData:any)
{
    totalLastIncome = 0;

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

            if(today.getMonth() != counter.InitialTime.Month)
                continue;
        }

        totalLastIncome += counter.Amount;
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

    calcDebt(parsedData);
    calcIncome(parsedData);
    calcExpenses(parsedData);
    calcSavings(parsedData);
    calcLastIncome(parsedData);

    return (
        <ul className="shadow divide-y divide-[#7f8fb5] min-h-0 border-b border-[#6d91e8]">

            <li className="px-[1vw] py-[1vh] group hover:bg-white/10">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Total Savings:</span>
                        {/*Change below to calculate actual savings once set up in database*/}
                        <span className="font-semibold text-md" style = {{color: (parsedData.User.totalSavings != 0) ? '#36eba6' :'#ff6384'}}> ${totalSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                </div>
                <p className="max-h-0 text-gray-300 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 ease-out visibility-hidden group-hover:visibility-visible">{parsedData.User.InitialAmount != 0 ? "~"+Math.floor((totalSavings/parsedData.User.InitialAmount) * 100) : "N/A"}% of your savings on signup.</p>
            </li>
            <li className="px-[1vw] py-[1vh] group hover:bg-white/10">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Total Debt:</span>
                        <span className="font-semibold text-md" style = {{color: (totalDebt == 0) ? '#36eba6' :'#ff6384'}}> ${totalDebt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <p className="max-h-0 text-gray-300 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 ease-out visibility-hidden group-hover:visibility-visible">{parsedData.User.InitialDebt != 0 ? "~"+Math.floor((totalDebt/parsedData.User.InitialDebt) * 100) : "N/A"}% of your debt on signup.</p>
                </div>
            </li>

            <li className="px-[1vw] py-[1vh] group hover:bg-white/10">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Assets to Liabilities Ratio:</span>
                        <p className="font-semibold text-md" style = {{color: (totalSavings/totalDebt >= 1) ? '#36eba6' :'#ff6384'}}>{totalDebt != 0 && totalSavings != 0 ? totalSavings/totalDebt >= 1? totalSavings/totalDebt +':1' : 1 + ':' + (1/(totalSavings/totalDebt)).toFixed(0) : "N/A"}</p>
                    </div>
                </div>
                <p className="max-h-0 text-gray-300 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 ease-out visibility-hidden group-hover:visibility-visible">Experts recommend between 3:1 and 5:1.</p>
            </li>

            <li className="px-[1vw] py-[1vh] group hover:bg-white/10">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Income this Month:</span>
                        <span className="font-semibold text-md" style = {{color: (totalIncome != 0) ? '#36eba6' :'#ff6384'}}> ${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                </div>
                {/*Update this so it is correct*/}
                <p className="max-h-0 text-gray-300 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 ease-out visibility-hidden group-hover:visibility-visible">~{totalIncome > 0 && totalLastIncome > 0 ? Math.floor((totalIncome/totalLastIncome) * 100): "N/A"}% of your income last month.</p>
            </li>

            <li className="px-[1vw] py-[1vh] group hover:bg-white/10">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Expenses this Month:</span>
                        <span className="font-semibold text-md" style = {{color: (totalExpenses <= totalIncome) ? '#36eba6' :'#ff6384'}}> ${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <p className="max-h-0 text-gray-300 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 ease-out visibility-hidden group-hover:visibility-visible">{totalIncome > 0 && totalExpenses > 0 ? "~" + Math.floor((totalExpenses/totalIncome) * 100) : "N/A"}% of your income this month.</p>
                </div>
            </li>
            
            <li className="px-[1vw] py-[1vh] group hover:bg-white/10">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Debt Payments this Month:</span>
                        <span className="font-semibold text-md" style = {{color: (totalMinPayments == 0) ? '#36eba6' :'#ff6384'}}> ${totalMinPayments.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <p className="max-h-0 text-gray-300 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:max-h-16 transition-all duration-300 ease-out visibility-hidden group-hover:visibility-visible">{totalIncome > 0 && totalMinPayments > 0 ? "~" + Math.floor((totalMinPayments/totalIncome) * 100) : "N/A"}% of your income this month.</p>
                </div>
            </li>
        </ul>
    );
}

export default StatList;