require('dotenv').config();
const express = require('express');
const fs = require('fs');
var log = require('./config/logger');
const app = express();
const port = process.env.PORT || 3000;

function execShellCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, (error, stdout, stderr) => {
    if (error) {
     console.warn(error);
    }
    resolve(stdout? stdout : stderr);
   });
  });
 }

app.get('/', (req, res) => res.send('This Web current development!'))
app.get('/publish/:projectName', async (req, res) => {
  const projectName = req.params.projectName;
  const isDirectoryExist = fs.existsSync(`repo/${projectName}`);

  if(isDirectoryExist) {
    log.info(`trying to deploy ${projectName}`);
    await execShellCommand(`sh command/publisher.sh ${projectName}`);
    res.send(`Your Project ${req.params.projectName} has been updated`); 
  } else {
    await execShellCommand(`git clone git@gitlab.com:dickyjiang/${projectName}.git repo/${projectName}`)
    log.info(`trying to deploy ${projectName}`);
    await execShellCommand(`sh command/publisher.sh ${projectName}`);
    res.send(`Your Project ${req.params.projectName} has been updated`);
  }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))