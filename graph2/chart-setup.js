document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect, false);
document
  .getElementById("dataSelection")
  .addEventListener("change", function () {
    const selectedOption = this.value; // Get the value of the selected option
    let statusText = "";

    switch (selectedOption) {
      case "calories":
        statusText = "Calories";
        break;
      case "inactiveHours":
        statusText = "Inactive Hours";
        break;
      case "activeHours":
        statusText = "Active Hours";
        break;
      default:
        statusText = "Select a data type...";
        break;
    }

    // Update the status display
    document.getElementById("statusDisplay").innerText = statusText;

    // Call updateChart with the current data and new status
    if (window.dataArray) {
      updateChart(window.dataArray, statusText);
    } else {
      console.error("No data available to update chart.");
    }
  });

function handleFileSelect(event) {
  const file = event.target.files[0];
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log("Parsed data:", results.data); // Debugging output
      if (results.errors.length) {
        console.error("Errors:", results.errors);
        return;
      }
      window.dataArray = results.data.map((row) => {
        return {
          date: row.summary_date,
          activeHours: (row.low + row.medium + row.high) / 60,
          inactiveHours: row.inactive / 60,
          cals: row.cal_total,
          weight: row.weight,
        };
      });
      console.log("Data array for chart:", window.dataArray); // Debugging output
    },
  });
}

function updateChart(dataArray, status) {
  const ctx = document.getElementById("myChart").getContext("2d");
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  const datasets = [
    {
      label: "Weight (lb)",
      data: dataArray.map((item) => item.weight),
      borderColor: "rgba(255, 99, 132, 1)",
      pointBackgroundColor: "red",
      fill: false,
      borderWidth: 1,
      yAxisID: "y1",
      spanGaps: true,
    },
  ];

  console.log("Status for chart update:", status); // Debugging output

  if (status === "Calories") {
    datasets.push({
      label: "Calories",
      data: dataArray.map((item) => item.cals),
      borderColor: "rgba(255, 99, 255, 0.8)",
      fill: false,
      borderWidth: 1,
    });
  } else if (status === "Active Hours") {
    datasets.push({
      label: "Active Hours",
      data: dataArray.map((item) => item.activeHours),
      borderColor: "rgba(0, 185, 12, 0.8)",
      fill: false,
      borderWidth: 1,
    });
  } else if (status === "Inactive Hours") {
    datasets.push({
      label: "Inactive Hours",
      data: dataArray.map((item) => item.inactiveHours),
      borderColor: "rgba(54, 162, 235, 1)",
      fill: false,
      borderWidth: 1,
    });
  }

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dataArray.map((item) => item.date),
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          beginAtZero: true,

          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      },
    },
  });
}
