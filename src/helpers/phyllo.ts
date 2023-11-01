export const BASE_URL = "https://api.staging.getphyllo.com";
export const accountExternalIdEndpoint = `/v1/users/external_id/`;
export const accountIdEndpoint = `/v1/accounts/`;
export const getUserEndpoint = "/v1/users/";
export const usersEndpoint = `/v1/users`;
export const sdktokenEndpoint = `/v1/sdk-tokens`;
export const getAccountsEndpoint = `/v1/accounts`;

export const generateUuid = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      console.log(v.toString(16));
      return v.toString(16);
    });
  };