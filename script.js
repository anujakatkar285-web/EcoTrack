let carbonChart;


/* =========================================
   EMISSION FACTORS
   These are simplified educational estimates.
========================================= */

const TRANSPORT_FACTOR = 0.21;
const ELECTRICITY_FACTOR = 0.70;
const WASTE_FACTOR = 0.50;


/* =========================================
   CALCULATE FOOTPRINT
========================================= */

function calculateFootprint() {

    const transportInput =
        document.getElementById("transport");

    const electricityInput =
        document.getElementById("electricity");

    const wasteInput =
        document.getElementById("waste");


    const transport =
        Number(transportInput.value);

    const electricity =
        Number(electricityInput.value);

    const waste =
        Number(wasteInput.value);


    /* Check empty values */

    if (
        transportInput.value === "" ||
        electricityInput.value === "" ||
        wasteInput.value === ""
    ) {

        alert("Please enter all three values.");

        return;
    }


    /* Check negative values */

    if (
        transport < 0 ||
        electricity < 0 ||
        waste < 0
    ) {

        alert("Please enter positive values only.");

        return;
    }


    /* Calculate emissions */

    const transportCarbon =
        transport * TRANSPORT_FACTOR;

    const electricityCarbon =
        electricity * ELECTRICITY_FACTOR;

    const wasteCarbon =
        waste * WASTE_FACTOR;


    const total =
        transportCarbon +
        electricityCarbon +
        wasteCarbon;


    /* Display total */

    document.getElementById("totalCarbon").textContent =
        total.toFixed(2);


    /* Display breakdown */

    document.getElementById("transportResult").textContent =
        transportCarbon.toFixed(2) + " kg";

    document.getElementById("electricityResult").textContent =
        electricityCarbon.toFixed(2) + " kg";

    document.getElementById("wasteResult").textContent =
        wasteCarbon.toFixed(2) + " kg";


    /* Dashboard */

    document.getElementById("dashTransport").textContent =
        transportCarbon.toFixed(2) + " kg";

    document.getElementById("dashElectricity").textContent =
        electricityCarbon.toFixed(2) + " kg";

    document.getElementById("dashWaste").textContent =
        wasteCarbon.toFixed(2) + " kg";


    /* Green score */

    calculateGreenScore(total);


    /* Message */

    updateMessage(total);


    /* Chart */

    createChart(
        transportCarbon,
        electricityCarbon,
        wasteCarbon
    );


    /* Save data */

    localStorage.setItem(
        "ecoTrackData",
        JSON.stringify({

            transport: transport,

            electricity: electricity,

            waste: waste,

            transportCarbon: transportCarbon,

            electricityCarbon: electricityCarbon,

            wasteCarbon: wasteCarbon,

            total: total

        })
    );


    /* Scroll to result */

    document.getElementById("dashboard").scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   GREEN SCORE
========================================= */

function calculateGreenScore(total) {

    let score;

    if (total <= 3) {

        score = 95;

    } else if (total <= 5) {

        score = 85;

    } else if (total <= 8) {

        score = 70;

    } else if (total <= 12) {

        score = 55;

    } else {

        score = 35;

    }


    document.getElementById("greenScore").textContent =
        score + "/100";


    document.getElementById("scoreBar").style.width =
        score + "%";
}


/* =========================================
   RESULT MESSAGE
========================================= */

function updateMessage(total) {

    const message =
        document.getElementById("message");


    if (total <= 3) {

        message.textContent =
            "Excellent! Your estimated footprint is relatively low. Keep building sustainable habits.";

    } else if (total <= 5) {

        message.textContent =
            "Good progress! A few more sustainable choices could help reduce your estimated footprint.";

    } else if (total <= 8) {

        message.textContent =
            "Your footprint has room for improvement. Consider reducing unnecessary travel and energy use.";

    } else {

        message.textContent =
            "Your estimated footprint is relatively high. Focus on transportation, energy saving and waste reduction.";

    }
}


/* =========================================
   CHART
========================================= */

function createChart(
    transport,
    electricity,
    waste
) {

    const canvas =
        document.getElementById("carbonChart");


    if (carbonChart) {

        carbonChart.destroy();

    }


    carbonChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [
                "Transport",
                "Electricity",
                "Waste"
            ],

            datasets: [{

                data: [
                    transport,
                    electricity,
                    waste
                ],

                borderWidth: 0

            }]

        },

        options: {

            responsive: true,

            cutout: "68%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        padding: 20,

                        font: {

                            family: "DM Sans"

                        }

                    }

                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return " " +
                                context.raw.toFixed(2) +
                                " kg CO₂";

                        }

                    }

                }

            }

        }

    });
}


/* =========================================
   LOAD SAVED DATA
========================================= */

window.addEventListener("load", function() {

    const saved =
        localStorage.getItem("ecoTrackData");


    if (!saved) {

        return;

    }


    const data =
        JSON.parse(saved);


    document.getElementById("transport").value =
        data.transport;

    document.getElementById("electricity").value =
        data.electricity;

    document.getElementById("waste").value =
        data.waste;


    document.getElementById("totalCarbon").textContent =
        data.total.toFixed(2);


    document.getElementById("transportResult").textContent =
        data.transportCarbon.toFixed(2) + " kg";

    document.getElementById("electricityResult").textContent =
        data.electricityCarbon.toFixed(2) + " kg";

    document.getElementById("wasteResult").textContent =
        data.wasteCarbon.toFixed(2) + " kg";


    document.getElementById("dashTransport").textContent =
        data.transportCarbon.toFixed(2) + " kg";

    document.getElementById("dashElectricity").textContent =
        data.electricityCarbon.toFixed(2) + " kg";

    document.getElementById("dashWaste").textContent =
        data.wasteCarbon.toFixed(2) + " kg";


    calculateGreenScore(data.total);

    updateMessage(data.total);


    createChart(
        data.transportCarbon,
        data.electricityCarbon,
        data.wasteCarbon
    );

});