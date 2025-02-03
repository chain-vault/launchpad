// Config api
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

import axios from 'axios';
import { camelizeKeys } from 'humps';

import { BASE_CONFIG } from '@constants/config';
import { SOMETHING_WENT_WRONG } from '@constants/programErrors';

type ApiConfigInputParams = {
  data?: any;
  includeAuth?: boolean;
  method: Method;
  params?: any;
  requestType?: string;
  url: string;
  withCredentials?: boolean;
};

/**
 * Axios api config to use to call api calls
 */
const apiConfig = async <T>({
  data,
  includeAuth,
  method,
  params,
  requestType,
  url,
  withCredentials,
}: ApiConfigInputParams): Promise<AxiosResponse<T>> => {
  const instance: AxiosInstance = axios.create({
    baseURL: BASE_CONFIG.appApiBaseURL,
    headers: {
      ...(requestType && { 'X-Request-Type': requestType }), // Add a custom header to specify the request type
      ...(includeAuth && {
        Authorization: JSON.parse(localStorage.getItem('gmtValue') ?? ''), // Add authorization token from localStorage
      }),
    },
    withCredentials,
    // Rest of the params for the instance like the auth, caches, xsrf tokens, header, response type, timeout can come here
  });
  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    ...(data && { data }),
    ...(params && { params }),
  };

  //   Request Interceptor
  instance.interceptors.request.use(
    (req) => req,
    (error) => Promise.reject(error)
  );

  //   Response Interceptor
  instance.interceptors.response.use(
    (res) => {
      // Extract and store cookies from response headers
      const cookies = res.headers['set-cookie'];
      if (cookies) {
        cookies.forEach((cookie: string) => {
          document.cookie = cookie;
        });
      }
      if (res.data && res.headers['content-type'] === 'application/json') {
        res.data = camelizeKeys(res.data);
      }
      return res;
    },
    (error) => {
      //   Handle error based on the status code
      let errorMessage = '';
      if (error.response) {
        // Request made and server responded
        errorMessage = `${errorMessage} ${
          error.response.data?.message || error.response.data?.errorMessage
        }`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += SOMETHING_WENT_WRONG;
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += SOMETHING_WENT_WRONG;
      }
      return Promise.reject(errorMessage);
    }
  );

  const response: AxiosResponse<T> = await instance.request<T>(requestConfig);
  return response;
};

export type { AxiosResponse };

export default apiConfig;
