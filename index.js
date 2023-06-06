import { getAllProjects, getFilesByProject, getFile } from "./openAssetAPI.js";

/**
 * Download all files in Open Asset sorted by projects to 'images' folder with folder name format '{project ID} - {project name}}'.
 * If projectIdStart is given, it will start from that ID. If not, it will start from project ID 1.
 * @date 6/6/2023 - 1:19:27 PM
 *
 * @async
 * @param {number} [projectIdStart] - Starting project ID.
 */
const getOAProjectFilesToFolder = async (projectIdStart) => {
  let allProjects = await getAllProjects();
  let projects = projectIdStart
    ? // ? allProjects.splice(projectIdStart - 1, 10)
      allProjects.splice(projectIdStart - 1)
    : allProjects;

  for (const project of projects) {
    const { id: project_id, name: project_name } = project;
    const files = await getFilesByProject(project_id);
    for (const file of files) {
      const { project_id, filename, sizes } = file;
      const originalSize = sizes.find(({ relative_path }) =>
        relative_path.includes(filename)
      );
      const { unc_root, relative_path } = originalSize;
      if (originalSize) {
        await getFile(unc_root, relative_path, project_id, project_name);
      } else {
        console.log("cannot find original file name in sizes.");
      }
    }
  }
};

/**
 * (Optional) Adding project id number as parameter as a starting point.
 */
getOAProjectFilesToFolder();
