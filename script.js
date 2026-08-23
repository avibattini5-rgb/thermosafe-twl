/* =====================================================
   THERMOSAFE — DEMO + MANUAL MONITOR
===================================================== */

const state = {
    mode: "DEMO",
    sensorConnected: true,
    readings: null,
    history: []
};


/* =====================================================
   DOM
===================================================== */

const $ = id => document.getElementById(id);


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const clock = $("currentTime");

    if (!clock) return;

    clock.textContent =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

updateClock();

setInterval(updateClock, 1000);


/* =====================================================
   DEMO SENSOR GENERATOR
===================================================== */

function generateDemoReading() {

    const time = Date.now() / 10000;

    return {

        airTemperature:
            41 + Math.sin(time) * 2,

        globeTemperature:
            49 + Math.sin(time * 0.8) * 2.5,

        wetBulbTemperature:
            29 + Math.sin(time * 0.7) * 1,

        windSpeed:
            2.2 + Math.sin(time * 1.3) * 0.5,

        pressure:
            100.8 + Math.sin(time * 0.2) * 0.2,

        relativeHumidity:
            47 + Math.sin(time * 0.6) * 4
    };
}


/* =====================================================
   DISPLAY SENSOR DATA
===================================================== */

function displayReadings(data) {

    $("airTemp").textContent =
        `${data.airTemperature.toFixed(1)} °C`;

    $("globeTemp").textContent =
        `${data.globeTemperature.toFixed(1)} °C`;

    $("wetBulb").textContent =
        `${data.wetBulbTemperature.toFixed(1)} °C`;

    $("windSpeed").textContent =
        `${data.windSpeed.toFixed(2)} m/s`;

    $("pressure").textContent =
        `${data.pressure.toFixed(1)} kPa`;

    $("humidity").textContent =
        `${data.relativeHumidity.toFixed(1)} %`;


    const time =
        new Date().toLocaleTimeString();

    $("lastUpdate").textContent = time;

    $("lastReading").textContent = time;
}


/* =====================================================
   SENSOR STATUS
===================================================== */

function setSensorOnline() {

    const sensor =
        document.querySelector(".sensor-state");

    const connection =
        document.querySelector(".connection strong");


    if (sensor) {

        sensor.innerHTML =
            `<span></span> SENSOR ONLINE`;

    }


    if (connection) {

        connection.textContent =
            "SYSTEM ONLINE";

    }
}


/* =====================================================
   DEMO LOOP
===================================================== */

function startDemoMode() {

    state.mode = "DEMO";

    setSensorOnline();


    function update() {

        const reading =
            generateDemoReading();

        state.readings = reading;

        displayReadings(reading);


        /*
         * TWL calculation is intentionally not
         * fabricated here.
         *
         * The validated TWL engine will consume
         * these measurements.
         */

        $("twlValue").textContent = "--";

        $("twlStatus").textContent =
            "DATA READY";

        $("statusDescription").textContent =
            "Live environmental measurements received.";

        $("statusIndicator").style.background =
            "#49e59a";

        $("statusIndicator").style.boxShadow =
            "0 0 15px #49e59a";

        $("siteStatus").textContent =
            "MONITORING";

        $("siteStatus").style.color =
            "#49e59a";

        $("siteMessage").textContent =
            "Live environmental telemetry is being received.";

        $("workZone").textContent =
            "AWAITING TWL ENGINE";

        state.history.push({

            time: new Date(),

            ...reading

        });

        /*
         * Keep the browser memory small.
         */

        if (state.history.length > 100) {

            state.history.shift();

        }
    }


    update();

    setInterval(update, 5000);
}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startDemoMode();

        console.log(
            "THERMOSAFE Demo Sensor Online"
        );

    }
);
