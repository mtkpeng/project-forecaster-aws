const { exec } = require("child_process");

exec("pushd . ; cd amplify/backend/function/calculateProjectForecast ; tsc ; popd", {'shell':'powershell.exe'}, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        process.exit(1)
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        process.exit(1)
    }
});