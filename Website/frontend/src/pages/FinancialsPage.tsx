import AddIncome from '../components/financialspagecomponents/AddIncome.tsx';
import NavBar from '../components/NavBar.tsx';
import AddExpense from '../components/financialspagecomponents/AddExpense.tsx';
import IncomeList from '../components/financialspagecomponents/IncomeList.tsx';
import ExpensesList from '../components/financialspagecomponents/ExpensesList.tsx';
import {useState} from 'react';

const FinancialsPage = () => {
  const [count, setCount] = useState(0);

  const triggerRerender = () => {
    
    setCount(count + 1);
  };

  return (
    <div className = "absolute top-0 left-0 h-full w-full bg-[rgba(0,26,51,1)]">
         <NavBar />

         <div className = "block fixed top-[32%] left-2/7 w-[30%] h-[48%] min-h-fit bg-[rgba(17,18,23,0.9)] border border-[#6d91e8] border-[1.5px] rounded-[2%] text-center transform -translate-x-1/2 -translate-y-1/2" id ="FinanceBar">
          <AddIncome triggerRerender={triggerRerender}/>
        </div>

        <div className = "block fixed top-[33%] left-[70%] w-[30%] h-[50%] min-h-fit bg-[rgba(17,18,23,0.9)] border border-[#6d91e8] border-[1.5px] rounded-[2%] text-center transform -translate-x-1/2 -translate-y-1/2" id = "VisualBar">
          <AddExpense triggerRerender={triggerRerender}/>
        </div>

        <div className = "block fixed top-[78%] left-2/7 w-[30%] h-[40%] min-h-fit bg-[rgba(17,18,23,0.9)] border border-[#6d91e8] border-[1.5px] rounded-[2%] text-center transform -translate-x-1/2 -translate-y-1/2" id = "IncomeListBar">
          <IncomeList triggerRerender={triggerRerender}/>
        </div>

        <div className = "block fixed top-[79%] left-[70%] w-[30%] h-[38%] min-h-fit bg-[rgba(17,18,23,0.9)] border border-[#6d91e8] border-[1.5px] rounded-[2%] text-center transform -translate-x-1/2 -translate-y-1/2" id = "ExpensesListBar">
          <ExpensesList triggerRerender={triggerRerender}/>
        </div>
    </div>
  );
};

export default FinancialsPage;
