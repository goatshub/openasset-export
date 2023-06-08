import * as path from "path";
import { fileURLToPath } from "url";
import { getAllProjects } from "./openAssetAPI.js";
import { createObjectCsvWriter } from "csv-writer";

/**
 * For saving returned Javascript object from API response to .csv file in local folder
 * @param {string} filename
 * @param {function} getDataAPIFunction
 */
const exportToCSV = async (filename, getDataAPIFunction) => {
  const __filename = fileURLToPath(import.meta.url);

  const __dirname = path.dirname(__filename);
  console.log(__dirname);
  const data = await getDataAPIFunction();
  const header = Object.keys(data[0]).map((key) => ({
    id: key,
    title: key,
  }));

  const writer = createObjectCsvWriter({
    path: path.resolve(__dirname, filename),
    header,
  });

  writer.writeRecords(data).then(() => {
    console.log("Done writing to " + filename);
  });
};

//Download projects list into .csv by running 'npm run export-projects-csv' in terminal
exportToCSV("projects.csv", getAllProjects);
