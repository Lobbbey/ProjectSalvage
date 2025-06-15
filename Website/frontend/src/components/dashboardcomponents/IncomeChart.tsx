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

function ParseLabels()
{
  var data = localStorage.getItem('user_data');
  var parsedData = data ? JSON.parse(data) : null;

  var labels = [];
  const today = new Date();

  for (var i = 0; i < parsedData.User.Income.length; i++) 
  {
    var counter = parsedData.User.Income[i];
    //console.log(counter.Category);

    if(counter.InitialTime != undefined)
    {
      let old = new Date(Date.UTC(counter.InitialTime.Year, counter.InitialTime.Month - 1, counter.InitialTime.Day));
      if((today.getTime() - old.getTime()) < 0)
          continue;

      if(today.getMonth() + 1 != counter.InitialTime.Month)
          continue;
    }

    labels.push(counter.Name);
  }

  return labels;
}

function ParseData()
{
  var data = localStorage.getItem('user_data');
  var parsedData = data ? JSON.parse(data) : null;

  var datapts = [];
  const today = new Date();

  for (var i = 0; i < parsedData.User.Income.length; i++) 
  {
    var counter = parsedData.User.Income[i];

    if(counter.InitialTime != undefined)
    {
      let old = new Date(Date.UTC(counter.InitialTime.Year, counter.InitialTime.Month - 1, counter.InitialTime.Day));
      if((today.getTime() - old.getTime()) < 0)
          continue;

      if(today.getMonth() + 1 != counter.InitialTime.Month)
          continue;
    }

    //console.log(counter.Amount);
    datapts.push(counter.Amount);
  }

  return datapts;
}

function IncomeChart() 
{
  var datap = localStorage.getItem('user_data');
  var parsedData = datap ? JSON.parse(datap) : null;

  if(parsedData.User.Income == undefined  || parsedData.User.Income.length == 0)
  {
      return(
          <div className="text-white p-5">
              <p className="mt-5">No income so far this month.</p>
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


  };

  return (
    <div className="flex items-center justify-center p-5">
      <Pie options={options} data={data}/>
    </div>
  );
};

export default IncomeChart;