import { setLoading } from "@redux/slices/app/appConfig";
import { useAppDispatch, useAppSelector } from "@redux/store/store";
import Toast from "react-native-toast-message";

export enum ERequestMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

type TRequestHeader = {
  authorization?: string;
};

type TRequestConfig = {
  multipart?: boolean;
  data?: any;
  method?: ERequestMethods;
  headers?: TRequestHeader;
  onProgress?: (progress: number) => void;
  authorized?: boolean;
  timeout?: number;
};

interface IRequest {
  // baseUrl?: string;
  subUrl: string;
  config: TRequestConfig;
}
interface IApiResponse {
  // Define your response structure here
  // Example: data: any;
  // You can extend this based on your API response format
  error?: string;
  // Add more fields if needed
}

const API_BASE_URL = process.env.API_BASE_URL ?? '';

console.log(API_BASE_URL, "APIIIII");


export default function useRestAPI() {
  const appConfigSlice = useAppSelector((state) => state.appConfig);
  const dispatch = useAppDispatch();
  const token = appConfigSlice.accessToken ?? '';

  async function callRESTAPI({
    subUrl,
    config: {
      method = ERequestMethods.GET,
      data = {},
      multipart = false,
      headers,
      onProgress,
      authorized = true,
      timeout = 30000, // Default timeout in milliseconds (30 seconds)
    },
  }: IRequest): Promise<IApiResponse | undefined | any> {
    if (!appConfigSlice.loading) {
      dispatch(setLoading(true));
    }

    if (process.env.API_ENVIRONMENT === "JSON") {
      return;
    } else {
      let config = {
        method,
        data,
        multipart,
        headers,
        onProgress,
        authorized,
        timeout,
      }

      let apiResponseJSON: any | IApiResponse = {}; // Initialize as an empty object

      try {
        let requestOptions: RequestInit = {
          method,
        };

        if (authorized) {
          requestOptions.headers = {
            ...requestOptions.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        if (method !== ERequestMethods.GET) {
          if (multipart) {
            requestOptions.headers = {
              ...requestOptions.headers,
              "Content-Type": "multipart/form-data",
            };
            const formData = new FormData();
            for (const key in data) {
              if (Array.isArray(data[key])) {
                data[key].forEach((val: any) => {
                  formData.append(key, val);
                });
              } else {
                formData.append(key, data[key]);
              }
            }
            requestOptions.body = formData;
          } else {
            requestOptions.headers = {
              ...requestOptions.headers,
              "Content-Type": "application/json",
            };
            requestOptions.body = JSON.stringify(data);
          }
        } else {
          // Handle GET request with query parameters
          const queryString = Object.keys(data)
            .map((key) => `${key}=${encodeURIComponent(data[key])}`)
            .join("&");
          if (queryString) {
            subUrl += `?${queryString}`;
          }
        }

        // Use Promise.race to handle the timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("Request timeout"));
          }, timeout);
        });

        console.log(API_BASE_URL, "BASE_URL");
        console.log(subUrl, "SUB_URL");
        console.log(requestOptions, 'REQUEST_OPTIONS');

        const responsePromise = fetch(
          `${API_BASE_URL}/${subUrl}`,
          requestOptions
        );

        const response = await Promise.race([responsePromise, timeoutPromise]);

        dispatch(setLoading(false));

        if (response instanceof Response) {
          apiResponseJSON = await response.json();

          if (response.ok && apiResponseJSON.success) {
            Toast.show({
              type: 'customToast',
              text1: apiResponseJSON?.message || ""
            });
            return apiResponseJSON.data;
          } else {
            let error = {
              status: response.status,
              reason: apiResponseJSON.error || 'Unknown server error',
            };
            throw new Error(JSON.stringify(error));
          }
        } else {
          throw new Error("Network error or request timeout");
        }
      } catch (error: any) {
        console.log(error, "ERROR");
        
        dispatch(setLoading(false));
        
        let errorMessage = 'An unknown error occurred';
        if (error.message.includes('Request timeout')) {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message) {
          try {
            const parsedError = JSON.parse(error.message);
            errorMessage = parsedError.reason || errorMessage;
          } catch {
            errorMessage = error.message;
          }
        }

        Toast.show({
          type: 'customToast',
          text1: errorMessage
        });

        return { error: { message: errorMessage } };
      }
    }
  }

  return {
    callRESTAPI,
  };
}
