const express = require('express');
import { Application, Request, Response } from 'express';
const cors = require('cors');
import * as dotenv from 'dotenv';
const multer = require('multer');
import { processFireflyAlgorithm } from './controllers/fireflyAlgorithmController';
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
app.post('/api/firefly/process', upload.single('file'), (req, res, next) => {
  processFireflyAlgorithm(req, res).catch(next);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
