import "dotenv/config";
import fs from "fs";
import { getAxios } from "./utils.js";

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
  return projects;
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
  return files;
};

/**
 * GET file from `{unc_root}{relative_path}` as base64 data and save the file to project folder.
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
  //escape special character not allowed as folder name
  let dir = `./images/${project_id} - ${project_name
    .toString()
    .replace(/[\\\/\?\*\|\<\>\:]/g, " ")}`;
  let relative_path_splitted = relative_path.split("/");
  let filename = relative_path_splitted[relative_path_splitted.length - 1];

  console.log(
    "Starts getting file " +
      filename +
      " of project " +
      project_id +
      " - " +
      project_name
  );

  //Check existing file in directory, if already saved then skip.
  if (fs.existsSync(`${dir}/${filename}`)) {
    console.log("File already downloaded");
    return null;
  }

  let photoData = await getAxios(`${unc_root}${relative_path}`, {
    responseType: "text",
    responseEncoding: "base64",
  });
  // console.log("photodata : ", photoData);

  //write file to dir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(`${dir}/${filename}`, photoData, {
    encoding: "base64",
  });
  console.log("Finish getting file");
};

export { getAllProjects, getFilesByProject, getFile };
