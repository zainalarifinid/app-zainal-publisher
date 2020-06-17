#!/usr/bin/env nodejs

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
var log = require('./config/logger');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + `/repo/fluffy-production-dashboard/dist/static`));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'build-file' );
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.tar.gz');
  }
});

const upload = multer({ storage: storage });

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

// app.get('/', (req, res) => res.send('This Web current development!'));

app.all("*", (req, res) => {
  try {
    if(req.path.split('/').length > 2) {
      res.sendFile(__dirname + `/repo/${req.path.replace('fluffy-production-dashboard', 'fluffy-production-dashboard/dist')}`);
    } else {
      res.sendFile(__dirname + `/repo/${req.path}/dist/index.html`);
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
});

// app.get('/:projectName', (req, res) => {
//   const projectName = req.params.projectName;
//   console.log(`user try to load ${projectName}`);
//   if(projectName) {
//     console.log(`res sendFile : ${__dirname + `/repo/${projectName}`}`);
//     res.sendFile(__dirname + `/repo/${projectName}/dist/index.html`);
//   }
// });

app.post('/publish/:projectName', upload.single('dataBuild'), async (req, res, next) => {
  const file = req.file;
  const projectName = req.params.projectName;
  if(!file) {
    const error = new Error('Please upload the correct build project file');
    error.httpStatusCode = 400;
    return next(error);
  }else{
    await execShellCommand(`rm -rf repo/${projectName} && mkdir repo/${projectName}`);
    await execShellCommand(`tar -xzvf ${file.path} --directory repo/${projectName} `)
    res.json({ code: 200, message: 'Project has been deployed!' });
  }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))