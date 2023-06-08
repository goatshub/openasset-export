import "dotenv/config";
import fs from "fs";
import { getAxios } from "./utils.js";
import ProgressBar from "progress";

const headerAuth = {
  headers: {
    Authorization: `OATU ${process.env.TOKEN_ID}:${process.env.TOKEN_STRING}`,
  },
};

/**
 * Get all projects within Open Asset.
 * https://developers.openasset.com/#get-all-projects
 * @date 6/6/2023 - 1:25:27 PM
 *
 * @async
 * @returns {Object[]} - all projects information
 */
const getAllProjects = async () => {
  let projects = await getAxios(
    "https://dwp.openasset.com/REST/1/Projects?limit=0",
    headerAuth
  );
  console.log("projects: ", projects);
  return projects.data;
};

/**
 * Get all files from project ID given.
 * https://developers.openasset.com/#query-parameters-files
 * @date 6/6/2023 - 1:27:26 PM
 *
 * @async
 * @param {number} project_id
 * @returns {Object[]}
 */
const getFilesByProject = async (project_id) => {
  console.log("Starts getting files by Project id: " + project_id);
  let files = await getAxios(
    `https://dwp.openasset.com/REST/1/Files?project_id=${project_id}&sizes=all&limit=0`,
    headerAuth
  );
  console.log("Finish getting files by Project id: " + project_id);
  return files.data;
};

/**
 * GET file from `{unc_root}{relative_path}` and download the file to project folder.
 * If file already exists, it will not not redownload.
 * @date 6/6/2023 - 1:29:38 PM
 *
 * @async
 * @param {string} [unc_root=""]
 * @param {string} [relative_path=""]
 * @param {string} [project_id=""]
 * @param {string} [project_name=""]
 */
const getFile = async (
  unc_root = "",
  relative_path = "",
  project_id = "",
  project_name = ""
) => {
  //Escape special character not allowed as folder name
  const dir = `./images/${project_id} - ${project_name
    .toString()
    .replace(/[\\\/\?\*\|\<\>\:]/g, " ")
    .trim()}`;
  //Create file path
  const relative_path_splitted = relative_path.split("/");
  const filename = relative_path_splitted[relative_path_splitted.length - 1];
  const filePath = `${dir}/${filename}`;
  console.log("Starts getting file " + filePath);

  //Check existing file in directory, if already saved then end the function.
  if (fs.existsSync(filePath)) {
    console.log("File already downloaded");
    return null;
  }

  let photoData = await getAxios(`${unc_root}${relative_path}`, {
    responseType: "stream",
  });
  // console.log("photodata : ", photoData);

  // Total file size for progress bar
  const totalLength = photoData.headers["content-length"];

  // Create a progress bar with the total file size
  const bar = new ProgressBar(":bar :percent", {
    width: 20,
    total: parseInt(totalLength),
  });

  // Create project folder if it doesn't exist.
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // Write the data to a local file
  const writer = fs.createWriteStream(filePath);

  // Promise-based file write
  await new Promise((resolve, reject) => {
    photoData.data.pipe(writer);
    photoData.data.on("end", () => {
      console.log(`Finished getting file ${filename}`);
    });
    photoData.data.on("error", (err) => {
      console.error("Error while streaming data: ", err.message);
      reject(err);
    });

    writer.on("finish", () => {
      console.log(`Finished writing file ${filename}`);
      resolve();
    });
    writer.on("error", (err) => {
      console.error("Error while writing data: ", err.message);
      reject(err);
    });

    photoData.data.on("data", (chunk) => {
      // Update the progress bar with the size of the data chunk
      bar.tick(chunk.length);
    });
  });
};

export { getAllProjects, getFilesByProject, getFile };
