export function getHeaders(jsonContentType = true) {
  const headers = {
    Accept: 'application/json',
  };
  if (jsonContentType) {
    headers['Content-Type'] = 'application/json';
  } else {
    headers['Content-Type'] = 'multipart/form-data; boundary="--"';
  }
  if (window.localStorage.jwt) {
    headers.Authorization = `JWT ${window.localStorage.jwt}`;
  }
  return headers;
}
