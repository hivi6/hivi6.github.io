const DUSTY_RED = 0xBA4949; // color for pomodoro mode
const DARK_AQUA = 0x38858A; // color for short-break mode
const UGLY_BLUE = 0x397097; // color for long-break mode

// ========== helper functions ==========

// Get the timer duration based on the current mode 
function getDurationByMode(mode) {
    switch (mode) {
        case "pomodoroMode": return 25 * 60;
        case "shortBreakMode": return 5 * 60;
        case "longBreakMode": return 15 * 60;
    }
}

// Get the background color
function getBackgroudColorByMode(mode) {
    switch (mode) {
        case "pomodoroMode": return "#" + DUSTY_RED.toString(16);
        case "shortBreakMode": return "#" + DARK_AQUA.toString(16);
        case "longBreakMode": return "#" + UGLY_BLUE.toString(16);
    }
}

// converting seconds like 63seconds to 1:03
function convertSecondsToTimerString(seconds) {
    return Math.floor(seconds / 60).toString().padStart(2, "0") + ":" + (seconds % 60).toString().padStart(2, "0");
}

// ========== timer state ==========

var globalTimerState = {
    currentMode: "pomodoroMode",
    currentTime: getDurationByMode(this.currentMode),
    isRunning: false,
    _myInterval: null,
    sessionCount: {
        pomodoroMode: 1,
        shortBreakMode: 1,
        longBreakMode: 1
    }
};

// ========== timer functions ==========

function updateTimerFunc() {
    globalTimerState.currentTime -= 1;
    if (globalTimerState.currentTime == -1) {
        globalTimerState.sessionCount[globalTimerState.currentMode]++;
        setTimerMode(globalTimerState.currentMode);
    }
    document.getElementById("time").innerHTML = convertSecondsToTimerString(globalTimerState.currentTime);
    progressPercentage = (getDurationByMode(globalTimerState.currentMode) - globalTimerState.currentTime) / getDurationByMode(globalTimerState.currentMode) * 100;
    document.getElementById("progress").style = `height: 2px; background-color: white; width: ${progressPercentage}%;`;
}

function resetTimer() {
    clearInterval(globalTimerState._myInterval);
    globalTimerState._myInterval = null;
    globalTimerState.isRunning = false;
    globalTimerState.currentTime = getDurationByMode(globalTimerState.currentMode)
    document.getElementById("time").innerHTML = convertSecondsToTimerString(globalTimerState.currentTime);
    document.getElementById("toggleButton").innerHTML = globalTimerState.isRunning ? "PAUSE" : "START";
    document.getElementById("pomodoroMode").className = ""
    document.getElementById("shortBreakMode").className = "";
    document.getElementById("longBreakMode").className = "";
}

function setTimerMode(mode) {
    resetTimer();
    globalTimerState.currentMode = mode;
    globalTimerState.currentTime = getDurationByMode(mode);
    document.getElementById("time").innerHTML = convertSecondsToTimerString(globalTimerState.currentTime);
    document.getElementById("toggleButton").innerHTML = globalTimerState.isRunning ? "PAUSE" : "START";
    document.getElementById("sessionText").innerHTML = globalTimerState.currentMode === "pomodoroMode" ? "Time to focus!" : "Time for a break!";
    document.getElementById(mode).className = "activeMode";
    document.body.style.backgroundColor = getBackgroudColorByMode(mode);
    document.getElementById("toggleButton").style.color = getBackgroudColorByMode(mode)
    document.getElementById("toggleButton").style.transform = null;
    document.getElementById("toggleButton").style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px";
    document.getElementById("sessionCount").innerHTML = "#" + globalTimerState.sessionCount[globalTimerState.currentMode];
    document.getElementById("progress").style = null;
}

function toggleTimer() {
    if (globalTimerState.isRunning) {
        globalTimerState.isRunning = false;
        clearInterval(globalTimerState._myInterval);
        globalTimerState._myInterval = null;
    } else {
        globalTimerState.isRunning = true;
        globalTimerState._myInterval = setInterval(updateTimerFunc, 1000);
    } 
    document.getElementById("toggleButton").innerHTML = globalTimerState.isRunning ? "PAUSE" : "START";
    document.getElementById("toggleButton").style.transform = globalTimerState.isRunning ? "translateY(6px)" : null;
    document.getElementById("toggleButton").style.boxShadow = globalTimerState.isRunning ? null : "rgb(235, 235, 235) 0px 6px 0px";
}

// ========== initialize the variables ==========
setTimerMode("pomodoroMode");
document.addEventListener("keydown", (ev) => {
    if (ev.key == ' ')
        toggleTimer();
})