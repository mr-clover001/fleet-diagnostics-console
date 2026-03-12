const fs = require("fs");
const path = require("path");

const vehicles = [1234, 5678, 2345, 8765, 3456, 6789, 4567, 9999, 8888];

const severities = ["ERROR", "WARN", "INFO"];

const codes = [
  "U0420",
  "P0300",
  "EVT01",
  "P0128",
  "C0035",
  "U0100",
  "P0455",
  "B0020",
  "EVT02",
];

const messages = [
  "Steering angle sensor malfunction",
  "Random misfire detected",
  "Diagnostic check completed",
  "Coolant thermostat malfunction",
  "Wheel speed sensor issue",
  "Lost communication with ECM",
  "Evaporative emission leak detected",
  "Airbag deployment circuit fault",
  "Routine system scan completed",
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLogs(count = 100) {
  const logs = [];

  let baseTime = new Date("2025-07-24T14:20:00");

  for (let i = 0; i < count; i++) {
    baseTime.setSeconds(baseTime.getSeconds() + 10);

    const timestamp = baseTime.toISOString().replace("T", " ").substring(0, 19);

    const log = `[${timestamp}] [VEHICLE_ID:${random(
      vehicles,
    )}] [${random(severities)}] [CODE:${random(codes)}] [${random(messages)}]`;

    logs.push(log);
  }

  // save inside src/seed folder
  const filePath = path.join(__dirname, "seed_logs.txt");

  // remove existing file
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // write new file
  fs.writeFileSync(filePath, logs.join("\n"));

  console.log(`${count} logs generated at ${filePath}`);
}

generateLogs(100);
