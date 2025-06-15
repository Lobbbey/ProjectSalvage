import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register required components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function GoalProgress() {
  const data = {
    datasets: [{
      label: 'Expenses',
      data: [60, 40],
      backgroundColor: [
        'rgb(54, 235, 166)',
        'transparent'
      ],
      hoverOffset: 4
    }]
  };

  const options = 
    {
      type: 'pie', // Or whatever your chart type is
      responsive: true,
      borderWidth:1,
      borderColor: "#6d91e8",
      events: [],
      hover: {
        mode: undefined,
        intersect: false,
      },
      tooltips: {
        enabled: false,
      },
      interaction: {
        mode: undefined, // Corrected line: use false to disable interactions
        intersect: false,
      },
    }

  return (
    <div className="h-[4vh]">
      <Pie options={options} data={data}/>
    </div>
  );
};

export default GoalProgress;