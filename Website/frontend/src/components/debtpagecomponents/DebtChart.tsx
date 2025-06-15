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

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

let labels: string[] = [];

function ParseLabels()
{
  var data = localStorage.getItem('user_data');
  var parsedData = data ? JSON.parse(data) : null;

  for (var i = 0; i < parsedData.User.Debts.length; i++) 
  {
    var counter = parsedData.User.Debts[i];
    //console.log(counter.Category);
    if(!labels.includes(counter.Name))
      labels.push(counter.Name);
  }

  return labels;
}

function ParseData()
{
  var data = localStorage.getItem('user_data');
  var parsedData = data ? JSON.parse(data) : null;

  let datapts = new Array(labels.length).fill(0);

  for (var i = 0; i < parsedData.User.Debts.length; i++) 
  {
    var counter = parsedData.User.Debts[i];
    //console.log(counter.Amount);
    datapts[labels.indexOf(counter.Name)] += counter.Amount;
  }

  return datapts;
}

function DebtChart() 
{
  var datap = localStorage.getItem('user_data');
  var parsedData = datap ? JSON.parse(datap) : null;

  if(parsedData.User.Debts == undefined || parsedData.User.Debts.length == 0)
  {
      return(
          <div className="text-white p-5">
              <p className="mt-5">No more info to display.</p>
          </div>
      );
  }

  const data = {
    labels: ParseLabels(),
    datasets: [{
      data: ParseData(),
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(54, 235, 166)',
        'rgb(133, 54, 235)',
        'rgb(235, 139, 54)',
        'rgb(54, 226, 235)'
      ],
      hoverOffset: 15
    }]
  };

  const options = {
    type:Pie,
    responsive: true,
    borderWidth: 1.5,
    plugins: {
      legend: {
        display: false, // Remove the legend
      },
    },
  };

  return (
    <div className="flex items-center justify-center w-[100%] h-[59%] p-5">
      <Pie options={options} data={data}/>
    </div>
  );
};

export default DebtChart;