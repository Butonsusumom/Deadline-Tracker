function setupProgressPieChart() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", SERVER_URL + '/student/progress', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('accessToken', localStorage.getItem('accessToken'));
    xhr.send();
    xhr.onload = function () {
        var proggress = JSON.parse(this.responseText);
        showPieChart(
            proggress["done"],
            proggress["todo"]
        );

        if (proggress["done"] == 100) {
            document.getElementById("firework").innerHTML = '<div class="before"></div><div class="after"></div>';
        }
    };
}

function showPieChart(done, todo, title) {

    CanvasJS.addColorSet("deadlines", [
        "#77fd77",
        "#ff7575"
    ]);

    var chart = new CanvasJS.Chart("chartContainer", {
        backgroundColor: "transparent",
        animationEnabled: true,
        colorSet: "deadlines",

        title: {
            text: title,
            fontColor: "white",
            fontFamily: 'Raleway'
        },
        data: [{
            type: "pie",
            startAngle: 270,
            indexLabelFontSize: 18,
            radius: 200,
            title: {
                text: title
            },
            yValueFormatString: "##0\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [{
                    y: done,
                    label: "Done"
                },
                {
                    y: todo,
                    label: "To do"
                },
            ]
        }]
    });
    chart.render();
}