import ExpenseChart from '../components/dashboardcomponents/ExpenseChart.tsx';
import IncomeChart from '../components/dashboardcomponents/IncomeChart.tsx';
import IncomeLineChart from '../components/dashboardcomponents/IncomeLineChart.tsx';
import ExpensesLineChart from '../components/dashboardcomponents/ExpensesLineChart.tsx';
import ExpensesList from '../components/dashboardcomponents/ExpensesList.tsx';
import IncomeList from '../components/dashboardcomponents/IncomeList.tsx';
import DebtList from '../components/dashboardcomponents/DebtList.tsx';
import SavingsList from '../components/dashboardcomponents/SavingsList.tsx';
import StatList from '../components/dashboardcomponents/StatList.tsx';
import NavBar from '../components/NavBar.tsx';


const DashboardPage = () => 
{
    //console.log(localStorage.getItem('token'));

    return (
    <div className="flex flex-col absolute top-0 left-0 h-[280vh] w-full bg-[rgba(0,26,51,1)]">
        <NavBar />

        <div className="flex justify-between w-full mt-[8vh]">
            <div className= "ml-8 w-[50vh] min-h-fit h-[60vh] border border-[#6d91e8] rounded-[2%] text-center bg-[rgba(17,18,23,.9)]">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]">Expenses</h3>
                </div>
                <ExpenseChart />
            </div>

            <div className= "ml-8 w-[50vh] min-h-fit h-[60vh] border border-[#6d91e8] rounded-[2%] text-center bg-[rgba(17,18,23,.9)]">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]">Income</h3>
                </div>
                <IncomeChart />
            </div>

            <div className= "flex-col ml-8 w-[50vh] h-[60vh] mr-8 border border-[#6d91e8] rounded-[2%] bg-[rgba(17,18,23,.9)]">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]">Statistics</h3>
                </div>
                <div className="flex flex-col w-[100%] h-[90%] rounded-lg grow min-h-0">
                    <StatList/>
                </div>
            </div>
        </div>

        {/* Fix Scaling Here!! */}
        <div className="flex justify-between w-full mt-[8vh]">
            <div className= "flex-col ml-8 w-[50vh] h-[60vh] border border-[#6d91e8] rounded-[2%] bg-[rgba(17,18,23,.9)]">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]">Recent Expenses</h3>
                </div>
                <div className="flex flex-col w-[100%] h-[90%] rounded-lg overflow-y-scroll grow min-h-0">
                    <ExpensesList/>
                </div>
            </div>

            <div className= "ml-8 w-[50vw] min-h-fit mr-8 h-[60vh] border border-[#6d91e8] rounded-lg text-center bg-white/90">
                <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8] mt-3">Total Expenses by Month</h3>
                <ExpensesLineChart />
            </div>
        </div>


        <div className="flex justify-between w-full mt-[8vh]">
            <div className= "flex-col ml-8 w-[50vh] h-[60vh] border border-[#6d91e8] rounded-[2%] bg-[rgba(17,18,23,.9)]">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]">Recent Income</h3>
                </div>
                <div className="flex flex-col w-[100%] h-[90%] rounded-lg overflow-y-scroll grow min-h-0">
                    <IncomeList/>
                </div>
            </div>

            <div className= "w-[50vw] min-h-fit h-[60vh] mr-8 border border-[#6d91e8] rounded-lg text-center bg-white/90">
                <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8] mt-3">Total Income by Month</h3>
                <IncomeLineChart />
            </div>
        </div>
        

        <div className="flex justify-center w-full mt-[8vh]">
            <div className= "flex-col ml-8 mr-20 w-[50vh] h-[60vh] border border-[#6d91e8] rounded-[2%] bg-[rgba(17,18,23,.9)]">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]">Top Debts</h3>
                </div>
                <div className="flex flex-col w-[100%] h-[90%] rounded-lg overflow-y-scroll grow min-h-0">
                    <DebtList/>
                </div>
            </div>

            <div className= "flex-col ml-20 w-[50vh] h-[60vh] border border-[#6d91e8] rounded-[2%] bg-[rgba(17,18,23,.9)]">
                <div className="flex h-[10%] items-center justify-center border-b border-[#6d91e8]">
                    <h3 className="font-[Lucida Sans] font-bold text-2xl text-[#6d91e8]">Top Accounts</h3>
                </div>
                <div className="flex flex-col w-[100%] h-[90%] rounded-lg overflow-y-scroll grow min-h-0">
                    <SavingsList/>
                </div>
            </div>
        </div>
    </div>
    );
    };

export default DashboardPage;