import axios from "axios";
import axiosRetry from "axios-retry";

/**
 * For retrying axios request when encountering error
 */
axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
});

/**
 * GET request using Axios, will retry if failed 3 times.
 * @date 6/6/2023 - 1:40:25 PM
 *
 * @async
 * @param {string} url
 * @param {Object} [option={}]
 * @returns {*} response data
 */
const getAxios = async (url, option = {}) => {
  try {
    const response = await axios.get(url, option);
    return response.data;
  } catch (error) {
    console.log("error in getAxios function");
    console.log(error.toJSON());
    console.log("ends error getAxios");
  }
};

export { getAxios };
