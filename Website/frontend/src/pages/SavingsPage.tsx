import NavBar from '../components/NavBar.tsx';
import AddSavings from '../components/savingspagecomponents/AddSavings.tsx';
import SavingsList from '../components/savingspagecomponents/SavingsList.tsx';
import StatList from '../components/savingspagecomponents/StatList.tsx';
import SavingsChart from '../components/savingspagecomponents/SavingsChart.tsx';
import {useState} from 'react';


const SavingsPage = () => {
  const [count, setCount] = useState(0);

  const triggerRerender = () => 
  {
    setCount(count + 1);
  };

  return (
    <div className = "absolute top-0 left-0 h-full w-full bg-[rgba(0,26,51,1)]">
      <NavBar />

      <div className = "flex-col block absolute top-4/8 left-2/7 w-[30%] h-[60%] bg-[rgba(17,18,23,0.9)] border border-[#6d91e8] border-[1.5px] rounded-[2%] text-center transform -translate-x-1/2 -translate-y-1/2" id ="FinanceBar">
          <StatList />
          <SavingsChart />
      </div>

      <div className = "block absolute top-[30%] left-[70%] w-[30%] h-[45%] min-h-fit bg-[rgba(17,18,23,0.9)] border border-[#6d91e8] border-[1.5px] rounded-[2%] text-center transform -translate-x-1/2 -translate-y-1/2" id = "VisualBar">
        <AddSavings triggerRerender={triggerRerender} />
      </div>

      
      <div className = "block absolute top-[76%] left-[70%] w-[30%] h-[44%] min-h-fit bg-[rgba(17,18,23,0.9)] border border-[#6d91e8] border-[1.5px] rounded-[2%] text-center transform -translate-x-1/2 -translate-y-1/2" id = "ExpensesListBar">
        <SavingsList triggerRerender={triggerRerender}/>
      </div>
    </div>
  );
};

export default SavingsPage;