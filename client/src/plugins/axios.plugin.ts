import axios from 'axios';

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.log('error', error?.response?.status);
    // const originalConfig = error.config;
    // if (error?.response?.status === 403) {
    //   originalConfig._retry = true;
    //   try {
    //     const rs = await axios.get(
    //       `${process.env.VUE_APP_URL}/api/auth/refresh`,
    //       {
    //         headers: { 'Content-Type': 'application/json' },
    //         withCredentials: true,
    //       },
    //     );
    //     const { accessToken } = rs.data;
    //     console.log('result', accessToken);
    //     originalConfig.headers.Authorization = `bearer ${accessToken}`;
    //     console.log('originalConfig', originalConfig);
    //     localStorage.setItem('token', accessToken);
    //     return axios(originalConfig);
    //     // return axiosInstance(originalConfig);
    //   } catch (_error) {
    //     return Promise.reject(_error);
    //   }
    // }
    // if (error?.response?.status === 401) {
    //   localStorage.clear();
    //   window.location.href = '/';
    //   return;
    // }
    return Promise.reject(error);
  },
);

// export const axiosRegister = (url: string, data = {}, option = {}) => {
//   return axios.post(`${process.env.VUE_APP_URL}/api/` + url, data);
// };

// export const axiosLogin = async (url: string, data = {}, option = {}) => {
//   const resdata = await axios.post(
//     `${process.env.VUE_APP_URL}/api/` + url,
//     data,
//     { headers: { 'Content-Type': 'application/json' }, withCredentials: true },
//   );

//   return resdata;
// };

// export const axiosAddTranasaction = async (
//   url: string,
//   data = {},
//   option = {},
// ) => {
//   const resdata = await axios.post(
//     `${process.env.VUE_APP_URL}/api/` + url,
//     data,
//   );
//   return resdata;
// };

// export const axioDataById = async (url: string, data = {}, option = {}) => {
//   const resdata = await axios.get(
//     `${process.env.VUE_APP_URL}/api/` + url,
//     data,
//   );
//   return resdata;
// };

// export const axioDeleteById = async (url: string, data = {}, option = {}) => {
//   const resdata = await axios.delete(
//     `${process.env.VUE_APP_URL}/api/` + url,
//     data,
//   );
//   return resdata;
// };

// export const axioupdateTransaction = async (
//   url: string,
//   data = {},
//   option = {},
// ) => {
//   const resdata = await axios.put(
//     `${process.env.VUE_APP_URL}/api/` + url,
//     data,
//   );
//   return resdata;
// };

// export const axiosingleData = async (url: string, data = {}, option = {}) => {
//   const resdata = await axios.get(
//     `${process.env.VUE_APP_URL}/api/` + url,
//     data,
//   );
//   return resdata;
// };
