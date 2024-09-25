// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser'
import { fileURLToPath } from "url";
import { dirname } from "path";
import logger from '@api/config/logger.js'
import { port, appName } from '@api/config/envars.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import indexRouter from '@api/routes/index.js'
import helloRouter from '@api/routes/hello.js'

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const loging = (req, res, next) => {
    let requestTime = new Date(Date.now());
  
    let request = {
      method: req.method,
      url: req.url,
      user: req.body
    };
  
    let originalSend = res.send;
    res.send = function (data) {
      // Record the execution time
      let executionTime = (new Date() - requestTime) + 'ms';
      
      let responseBody;
      try {
        responseBody = JSON.parse(data);  // Try to parse the response as JSON
      } catch (error) {
        responseBody = data;  // If it's not JSON, keep it as is
      }
  
      let response = {
        statusCode: res.statusCode,
        body: responseBody
      };
  
      let log = {
        appName,
        requestTime: requestTime.toISOString(),  // Format time in ISO string
        executionTime,
        request,
        response
      };
  
      logger.log('info', JSON.stringify(log));
  
      // Call the original res.send with the provided data
      originalSend.apply(res, arguments);
    };
    next();
  };

app.use(loging);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', helloRouter);

logger.info(`Listening on port ${port}`)

export default app;
