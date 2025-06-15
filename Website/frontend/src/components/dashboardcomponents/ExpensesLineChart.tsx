import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ParseData()
{
  var data = localStorage.getItem('user_data');
  var parsedData = data ? JSON.parse(data) : null;

  // This may need to be changed depending on time frame moving ability
  var datapts = new Array(12).fill(0);

  for (var i = 0; i < parsedData.User.Expenses.length; i++) 
  {
    var counter = parsedData.User.Expenses[i];
    if(counter.InitialTime == undefined) continue;
    
    //console.log(counter.InitialTime.Month);
    datapts[counter.InitialTime.Month - 1] += counter.Amount;
  }

  return datapts; // Change to datapoints
}

function ExpensesLineChart() 
{
  var datap = localStorage.getItem('user_data');
  var parsedData = datap ? JSON.parse(datap) : null;

  if(parsedData.User.Expenses == undefined || parsedData.User.Expenses.length == 0)
  {
      return(
          <div className="p-5 text-black">
              <p className="mt-5">Looks like you haven't spent anything yet! No expenses to display.</p>
          </div>
      );
  }

  var dataset = ParseData();
  const data = {
    labels: [
      'January',
      'Febuary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [{
      data: dataset,
      hoverOffset: 4
    }]
  };

  const options = {
    type:Line,
    responsive: true,
    backgroundColor: 'black',
    plugins: {
        legend: {
          display: false, // Remove the legend
        },
    },
    scales: {
        y: {
          min: Math.min.apply(null, dataset) > 0 ? Math.floor((Math.min.apply(null, dataset) - 300) / 100) * 100 : 0, 
          max: Math.ceil((Math.max.apply(null, dataset) + 300) / 100) * 100,
        },
    },


  };

  return (
    <div className="flex items-center justify-center p-5">
      <Line options={options} data={data}/>
    </div>
  );
};

export default ExpensesLineChart;