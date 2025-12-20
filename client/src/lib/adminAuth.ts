const LS_ADMIN_TOKEN = "admin_token";

export const setAdminToken = (token: string) => {
  localStorage.setItem(LS_ADMIN_TOKEN, token);
};

export const getAdminToken = () => {
  return localStorage.getItem(LS_ADMIN_TOKEN);
};

export const clearAdminToken = () => {
  localStorage.removeItem(LS_ADMIN_TOKEN);
};

export const isAdminAuthed = () => {
  return !!getAdminToken();
};
