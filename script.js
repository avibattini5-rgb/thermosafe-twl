/* =====================================================
   THERMOSAFE — TWL MONITOR
   Dashboard Controller
===================================================== */


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const clock = document.getElementById("currentTime");

    if (!clock) return;

    const now = new Date();

    clock.textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

updateClock();

setInterval(updateClock, 1000);


/* =====================================================
   DOM ELEMENTS
===================================================== */

const elements = {

    twl: document.getElementById("twlValue"),

    twlStatus: document.getElementById("twlStatus"),

    statusDescription:
        document.getElementById("statusDescription"),

    statusIndicator:
        document.getElementById("statusIndicator"),

    siteStatus:
        document.getElementById("siteStatus"),

    siteStatusDot:
        document.getElementById("siteStatusDot"),

    siteMessage:
        document.getElementById("siteMessage"),

    workZone:
        document.getElementById("workZone"),

    lastReading:
        document.getElementById("lastReading"),

    lastUpdate:
        document.getElementById("lastUpdate"),

    airTemp:
        document.getElementById("airTemp"),

    globeTemp:
        document.getElementById("globeTemp"),

    wetBulb:
        document.getElementById("wetBulb"),

    windSpeed:
        document.getElementById("windSpeed"),

    pressure:
        document.getElementById("pressure"),

    humidity:
        document.getElementById("humidity")
};


/* =====================================================
   APPLICATION STATE
===================================================== */

const state = {

    liveMode: false,

    sensorConnected: false,

    environmentalData: null,

    twl: null,

    lastUpdated: null

};


/* =====================================================
   DISPLAY HELPERS
===================================================== */

function setText(element, value) {

    if (!element) return;

    element.textContent = value;
}


function formatNumber(value, decimals = 1) {

    if (typeof value !== "number" ||
        !Number.isFinite(value)) {

        return "—";
    }

    return value.toFixed(decimals);
}


/* =====================================================
   ENVIRONMENTAL DATA DISPLAY
===================================================== */

function updateEnvironmentalDisplay(data) {

    if (!data) return;


    setText(
        elements.airTemp,
        `${formatNumber(data.airTemperature)} °C`
    );


    setText(
        elements.globeTemp,
        `${formatNumber(data.globeTemperature)} °C`
    );


    setText(
        elements.wetBulb,
        `${formatNumber(data.wetBulbTemperature)} °C`
    );


    setText(
        elements.windSpeed,
        `${formatNumber(data.windSpeed, 2)} m/s`
    );


    setText(
        elements.pressure,
        `${formatNumber(data.pressure, 1)} kPa`
    );


    setText(
        elements.humidity,
        `${formatNumber(data.relativeHumidity)} %`
    );


    const now = new Date();

    setText(
        elements.lastUpdate,
        now.toLocaleTimeString()
    );


    setText(
        elements.lastReading,
        now.toLocaleTimeString()
    );

}


/* =====================================================
   TWL STATUS CLASSIFICATION
===================================================== */

/*
   IMPORTANT:

   These ranges are displayed for interface
   development only.

   Before using this system for actual workplace
   safety decisions, the TWL calculation, thresholds,
   sensor inputs, calibration and site requirements
   must be validated against the applicable
   occupational-health/HSE standard.
*/


function classifyTWL(twl) {

    if (!Number.isFinite(twl)) {

        return {

            zone: "UNAVAILABLE",

            title: "CALCULATING",

            description:
                "Awaiting validated environmental data",

            level: "unknown"

        };
    }


    if (twl < 115) {

        return {

            zone: "RESTRICTED",

            title: "HIGH HEAT LOAD",

            description:
                "Conditions require immediate HSE evaluation.",

            level: "critical"

        };

    }


    if (twl < 140) {

        return {

            zone: "BUFFER",

            title: "BUFFER ZONE",

            description:
                "Conditions require increased monitoring.",

            level: "warning"

        };

    }


    if (twl <= 220) {

        return {

            zone: "ACCLIMATIZATION",

            title: "ACCLIMATIZATION",

            description:
                "Conditions require appropriate acclimatization controls.",

            level: "caution"

        };

    }


    return {

        zone: "UNRESTRICTED",

        title: "UNRESTRICTED",

        description:
            "Environmental conditions are within the highest TWL range.",

        level: "safe"

    };
}


/* =====================================================
   UPDATE TWL DISPLAY
===================================================== */

function updateTWLDisplay(twl) {

    const result = classifyTWL(twl);


    if (Number.isFinite(twl)) {

        setText(
            elements.twl,
            Math.round(twl)
        );

    } else {

        setText(
            elements.twl,
            "--"
        );

    }


    setText(
        elements.twlStatus,
        result.title
    );


    setText(
        elements.statusDescription,
        result.description
    );


    setText(
        elements.workZone,
        result.zone
    );


    updateStatusColor(result.level);

}


/* =====================================================
   STATUS COLORS
===================================================== */

function updateStatusColor(level) {

    const colors = {

        safe: "#49e59a",

        caution: "#ffd166",

        warning: "#ff9f43",

        critical: "#ff5964",

        unknown: "#43d9ff"

    };


    const color =
        colors[level] || colors.unknown;


    if (elements.statusIndicator) {

        elements.statusIndicator.style.background =
            color;

        elements.statusIndicator.style.boxShadow =
            `0 0 15px ${color}`;

    }


    if (elements.siteStatusDot) {

        elements.siteStatusDot.style.background =
            color;

        elements.siteStatusDot.style.boxShadow =
            `0 0 16px ${color}`;

    }


    if (elements.twlStatus) {

        elements.twlStatus.style.color =
            color;

    }


    if (elements.siteStatus) {

        elements.siteStatus.style.color =
            color;

    }

}


/* =====================================================
   SITE STATUS
===================================================== */

function updateSiteStatus(twl) {

    const result = classifyTWL(twl);


    if (!Number.isFinite(twl)) {

        setText(
            elements.siteStatus,
            "MONITORING"
        );


        setText(
            elements.siteMessage,
            "Environmental conditions are being evaluated."
        );


        return;
    }


    if (result.level === "critical") {

        setText(
            elements.siteStatus,
            "ACTION REQUIRED"
        );


        setText(
            elements.siteMessage,
            "Heat conditions require immediate HSE review."
        );

        return;
    }


    if (result.level === "warning") {

        setText(
            elements.siteStatus,
            "CAUTION"
        );


        setText(
            elements.siteMessage,
            "Conditions are approaching a restricted range."
        );

        return;
    }


    if (result.level === "caution") {

        setText(
            elements.siteStatus,
            "MONITORING"
        );


        setText(
            elements.siteMessage,
            "Acclimatization and heat-control measures should be considered."
        );

        return;
    }


    setText(
        elements.siteStatus,
        "NORMAL"
    );


    setText(
        elements.siteMessage,
        "Environmental conditions are within the current TWL range."
    );

}


/* =====================================================
   CENTRAL DASHBOARD UPDATE
===================================================== */

function updateDashboard(data, twl = null) {

    state.environmentalData = data;

    state.twl = twl;

    state.lastUpdated = new Date();


    updateEnvironmentalDisplay(data);

    updateTWLDisplay(twl);

    updateSiteStatus(twl);

}


/* =====================================================
   SENSOR CONNECTION STATE
===================================================== */

function setSensorConnection(connected) {

    state.sensorConnected = connected;

    const sensorState =
        document.querySelector(".sensor-state");

    const connectionText =
        document.querySelector(".connection strong");


    if (connected) {

        if (sensorState) {

            sensorState.innerHTML =
                `<span></span> SENSOR FEED`;

        }


        if (connectionText) {

            connectionText.textContent =
                "SYSTEM ONLINE";

        }

    } else {

        if (sensorState) {

            sensorState.innerHTML =
                `<span style="
                    background:#ff5964;
                    box-shadow:0 0 12px #ff5964;
                "></span> SENSOR OFFLINE`;

        }


        if (connectionText) {

            connectionText.textContent =
                "SENSOR DISCONNECTED";

        }

    }

}


/* =====================================================
   LIVE DATA INTERFACE
===================================================== */

/*
   This function is intentionally separated from
   the dashboard.

   Later we can connect it to:

   • Weather station
   • IoT sensor gateway
   • MQTT
   • REST API
   • WebSocket
   • Industrial monitoring system
*/


async function fetchLiveSensorData() {

    /*
       REAL SENSOR CONNECTION GOES HERE.

       Example expected response:

       {
           airTemperature: 42.6,
           globeTemperature: 51.2,
           wetBulbTemperature: 29.8,
           windSpeed: 2.4,
           pressure: 100.8,
           relativeHumidity: 48
       }

       Do NOT put fake values here and label
       them as live sensor data.
    */


    console.log(
        "Waiting for validated sensor/API connection..."
    );

}


/* =====================================================
   LIVE MONITOR LOOP
===================================================== */

async function startLiveMonitoring() {

    state.liveMode = true;


    setSensorConnection(false);


    try {

        await fetchLiveSensorData();

    }

    catch (error) {

        console.error(
            "Sensor connection error:",
            error
        );

        setSensorConnection(false);

    }

}


/* =====================================================
   INITIALIZE APPLICATION
===================================================== */

function initializeThermoSafe() {

    console.log(
        "THERMOSAFE initialized."
    );


    console.log(
        "TWL engine awaiting validated implementation."
    );


    updateDashboard(
        null,
        null
    );


    startLiveMonitoring();

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeThermoSafe
);
