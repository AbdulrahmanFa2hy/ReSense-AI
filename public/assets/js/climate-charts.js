// ###################################################
// Start Bar Chart //

var options = {
  series: [
    {
      name: "Temp",
      data: [7.9, 7.1, 8, 7.55, 7.55, 7.3],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 1000,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: "end",
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
  },
};

var barChart = new ApexCharts(
  document.querySelector("#climate-bar-chart"),
  options
);
barChart.render();

// End Bar Chart //
// ###################################################

// ###################################################
// Start Basic Line Chart //
var options = {
  series: [
    {
      name: "Desktops",
      data: ["24", "23", "22", "23.8", "21", "14", "18", "16"],
    },
  ],
  chart: {
    height: 350,
    type: "line",
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  title: {
    text: "Product Trends by Month",
    align: "left",
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
  },
};

var basicLineChart = new ApexCharts(
  document.querySelector("#climate-basic-line-chart"),
  options
);
basicLineChart.render();

// End Basic Line Chart //
// ###################################################

// ###################################################
// Start 2 Line Chart //

var options = {
  series: [
    {
      // name: "High - 2013",
      data: [28, 29, 33, 36, 32, 32, 33],
    },
    {
      // name: "Low - 2013",
      data: [12, 11, 14, 18, 17, 13, 13],
    },
  ],
  chart: {
    height: 350,
    type: "line",
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2,
    },
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: true,
    },
  },
  colors: ["#77B6EA", "#545454"],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: "smooth",
  },
  title: {
    text: "Temperature Forcasat",
    align: "left",
  },
  grid: {
    borderColor: "#e7e7e7",
    row: {
      colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  markers: {
    size: 1,
  },
  xaxis: {
    categories: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    title: {
      text: "Year",
    },
  },
  yaxis: {
    title: {
      text: "Temperature",
    },
    min: 5,
    max: 40,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: -10,
    offsetX: -5,
  },
};

var lineChart = new ApexCharts(
  document.querySelector("#climate-line-chart"),
  options
);
lineChart.render();

// End 2 Line Chart //
// ###################################################

// ###################################################
// Start Pie Chart //
var options = {
  series: [50, 55, 25],
  chart: {
    width: 380,
    type: "pie",
  },
  labels: ["Temperature Q1", "Temperature Q2", "Temperature Q3"],
  responsive: [
    {
      breakpoint: 400,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

var chart = new ApexCharts(
  document.querySelector("#climate-pie-chart"),
  options
);
chart.render();

// End Pie Chart //
// ###################################################
