//Creating a variable to store the current chart
var currentChart;
var chartTypeLine = true;
// Add an event listener to the HTML element with the id 'renderBtn'. That's our 
// button. When the event 'click' happens (when the button is clicked), run the 
// function 
document.getElementById('renderBtn').addEventListener('click', fetchData);
document.getElementById('chartTypeBtn').addEventListener('click', chartTypeSelect);

async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        renderChart(data, labels, countryName);
    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

async function chartTypeSelect() {
    chartTypeLine = !chartTypeLine;    
    if (currentChart) {
        //Clear the previous chart if it exists
        currentChart.destroy();
        //Fetches the data again, where renderChart is called if response status is good
        fetchData();
    }
}

function renderChart(data, labels, countryName) {
    //gets the 2D-context (canvas) element
    var ctx = document.getElementById('myChart').getContext('2d');

    //if currentChart exists = a chart has been drawn
    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }

    // Draw new chart, setting the variable currentChart to be the drawn chart
    if (chartTypeLine === true) {
        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Population, ' + countryName,
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
        );
    } else {
        currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Population, ' + countryName,
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    )}
};