import * as fs from 'fs';
import * as readline from 'readline';
import { PythonShell, Options } from 'python-shell';

export const runFireflyAlgorithm = async (datasetPath: string): Promise<string> => {
  try {
    console.log('Running firefly algorithm for dataset:', datasetPath);
    await executeBusinessLogic(datasetPath);
    const result = `Firefly algorithm executed for dataset ID: ${datasetPath}`;
    return result;
  } catch (error) {
    console.error('Error running firefly algorithm:', error);
    throw new Error('Failed to run firefly algorithm');
  }
};

const executeBusinessLogic = async (datasetPath: string): Promise<void> => {
  if (datasetPath) {
    await convertArffToCsv(datasetPath, 'dataset.csv');
  }

  const fireflyResult = await runPythonScript('firefly_algorithm.py');
  console.log('Firefly Result:', fireflyResult);
};

function convertArffToCsv(arffPath: string, csvPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(arffPath),
      output: process.stdout,
      terminal: false
    });

    const csvStream = fs.createWriteStream(csvPath, { flags: 'w' });
    let isDataSection = false;

    readInterface.on('line', (line) => {
      if (line.trim().startsWith('@data')) {
        isDataSection = true;
      } else if (isDataSection && line.trim()) {
        csvStream.write(line + '\n');
      }
    });

    readInterface.on('close', () => {
      csvStream.end();
      resolve();
    });

    readInterface.on('error', (error) => {
      reject(error);
    });
  });
}

async function runPythonScript(scriptPath: string): Promise<any> {
  const options: Options = {
    mode: 'json',
    pythonPath: 'python',
    scriptPath: './',
    args: ['C:/src/firefly/service/dataset.csv']
  };

  console.log('Running Python script:');
  let result: any;
  try {
    result = await PythonShell.run(scriptPath, options);
  } catch (err) {
    console.error('Error running Python script:', err);
    throw new Error('Failed to execute Python script');
  }

  return result;
}