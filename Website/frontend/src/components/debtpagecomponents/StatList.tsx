var totalDebt = 0, totalMinPayments = 0;
var totalIncome = 0, totalExpenses = 0;
var averageAPR = 0.0, totalSavings=0.0;

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

function calcAverageAPR(parsedData:any)
{
    averageAPR = 0;

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

        averageAPR += counter.APR;
    }

    averageAPR = averageAPR / parsedData.User.Debts.length;
}

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

function StatList() 
{
    var data = localStorage.getItem('user_data');
    var parsedData = data ? JSON.parse(data) : null;

    if(parsedData.User.Debts == undefined || parsedData.User.Debts.length == 0) 
        return(
            <div>
                <ul className="shadow divide-y divide-[#7f8fb5] min-h-0 border-b border-[#6d91e8]">
                <li className="px-[1vw] py-[1vh] group">
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-white font-semibold text-3xl">Total Debt:</span>
                            <span className="font-semibold text-3xl text-[#ff6384]"> $0.00</span>
                        </div>
                    </div>
                </li>
                </ul>
            </div>
    );


    calcDebt(parsedData);
    calcIncome(parsedData);
    calcExpenses(parsedData);
    calcAverageAPR(parsedData);
    calcSavings(parsedData);

    return (
        <ul className="shadow divide-y divide-[#7f8fb5] min-h-0 border-b border-[#6d91e8]">
            <li className="px-[1vw] py-[1vh] group">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-3xl">Total Debt:</span>
                        <span className="font-semibold text-3xl" style = {{color: (totalDebt == 0) ? '#36eba6' :'#ff6384'}}> ${totalDebt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                </div>
            </li>

            <li className="px-[1vw] py-[1vh] group">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Number of Debts:</span>
                        <span className="font-semibold text-md" style = {{color: (totalMinPayments == 0) ? '#36eba6' :'#ff6384'}}>{parsedData.User.Debts.length}</span>
                    </div>
                   
                </div>
            </li>

            <li className="px-[1vw] py-[1vh] group">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Assets to Liabilities Ratio:</span>
                        <p className="font-semibold text-md" style = {{color: (totalSavings/totalDebt >= 1) ? '#36eba6' :'#ff6384'}}>{totalDebt != 0 ? totalSavings/totalDebt >= 1? totalSavings/totalDebt +':1' : 1 + ':' + (1/(totalSavings/totalDebt)).toFixed(0) : "N/A"}</p>
                    </div>
                </div>
            </li>

            <li className="px-[1vw] py-[1vh] group">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Total Min Monthly Payments:</span>
                        <span className="font-semibold text-md" style = {{color: (totalMinPayments == 0) ? '#36eba6' :'#ff6384'}}> ${totalMinPayments.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                </div>
            </li>

            <li className="px-[1vw] py-[1vh] group">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Average Min Monthly Payment:</span>
                        <span className="font-semibold text-md" style = {{color: (totalMinPayments == 0) ? '#36eba6' :'#ff6384'}}> ${(totalMinPayments/parsedData.User.Debts.length).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                </div>
            </li>
            
            <li className="px-[1vw] py-[1vh] group">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-md">Average Interest Rate:</span>
                        <span className="font-semibold text-md" style = {{color: (averageAPR < 10) ? '#36eba6' :'#ff6384'}}> {averageAPR.toFixed(2)}%</span>
                    </div>
                </div>
            </li>
        </ul>
    );
}

export default StatList;