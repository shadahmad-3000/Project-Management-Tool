// all the paths of api defined here
// const env = prod;
// BASE URL IN THE ENV
const ACTIVE_ENVIRONMENT = "local";
const CONFIGS = {
  local: {
    metro_base: "http://localhost",
    metro_port: "3000",
    auth_port: "3001",
    external_port: "3002",
    versions: {
      auth: "v1",
      metro: "v3",
      external: "v2",
    },
  },
  staging: {
    metro_base: "https://staging.autope.in",
    metro_port: "",
    auth_port: "",
    external_port: "",
    versions: {
      auth: "v1",
      metro: "v3",
      external: "v2",
    },
  },
  staging_ip: {
    metro_base: "http://35.200.153.72",
    metro_port: "3000",
    auth_port: "3001",
    external_port: "3002",
    versions: {
      auth: "v1",
      metro: "v3",
      external: "v2",
    },
  },
  production: {
    metro_base: "https://dmrc.autope.in",
    metro_port: "",
    auth_port: "",
    external_port: "",
    versions: {
      auth: "v1",
      metro: "v3",
      external: "v2",
    },
  },
};

const ACTIVE_CONFIG = CONFIGS[ACTIVE_ENVIRONMENT];

const buildUrl = (base, port, service, version) => {
  const portString = port ? `:${port}` : "";
  const versionString = version ? `/${version}` : "";
  return `${base}${portString}/${service}${versionString}`;
};
const METRO_PATH = buildUrl(
  ACTIVE_CONFIG.metro_base,
  ACTIVE_CONFIG.metro_port,
  "metro",
  ACTIVE_CONFIG.versions.metro
);
const EXTERNAL_PATH = buildUrl(
  ACTIVE_CONFIG.metro_base,
  ACTIVE_CONFIG.external_port,
  "external",
  ACTIVE_CONFIG.versions.external
);
const AUTH_PATH = buildUrl(
  ACTIVE_CONFIG.metro_base,
  ACTIVE_CONFIG.metro_port,
  "auth",
  ""
);
const OTP_PATH = buildUrl(
  ACTIVE_CONFIG.metro_base,
  ACTIVE_CONFIG.metro_port,
  "otp",
  ""
);

const SUPER_ADMIN_PATH = buildUrl(
  ACTIVE_CONFIG.metro_base,
  ACTIVE_CONFIG.metro_port,
  "sup-admin",
  ""
);
const TEAM_PATH = buildUrl(
  ACTIVE_CONFIG.metro_base,
  ACTIVE_CONFIG.metro_port,
  "team",
  ""
);
const USER_PATH = buildUrl(
  ACTIVE_CONFIG.metro_base,
  ACTIVE_CONFIG.metro_port,
  "user",
  ""
);

export const apiPaths = {
  userSignin: `${AUTH_PATH}/sign-in`,
  userLogout: `${AUTH_PATH}/log-out`,
  userChangePassword: `${AUTH_PATH}/change-password`,
  forgetPassword: `${AUTH_PATH}/forget-password`,
  resetPassword: `${AUTH_PATH}/reset-password`,
  sendOtp: `${OTP_PATH}/sent-otp`,
  resendOtp: `${OTP_PATH}/resend-otp`,
  verifyOtp: `${OTP_PATH}/verify-otp`,
  addUsers: `${SUPER_ADMIN_PATH}/add-users`,
  getPendingUsers: `${SUPER_ADMIN_PATH}/pending-users`,
  approveUserById: (id) => `${SUPER_ADMIN_PATH}/approve-users/${id}`,
  declineUserById: (id) => `${SUPER_ADMIN_PATH}/decline-user/${id}`,
  assignRoletoUser: `${SUPER_ADMIN_PATH}/assign-role`,
  createProject: `${SUPER_ADMIN_PATH}/create-project`,
  updateProject: `${SUPER_ADMIN_PATH}/update-project`,
  getProject: `${SUPER_ADMIN_PATH}/get-project`,
  getProjectById: (projectCode) =>
    `${SUPER_ADMIN_PATH}/getProjectbyId/${projectCode}`,
  createTask: `${SUPER_ADMIN_PATH}/create-task`,
  updateTask: `${SUPER_ADMIN_PATH}/update-task`,
  getTask: `${SUPER_ADMIN_PATH}/get-task`,
  getTaskById: (taskId) => `${SUPER_ADMIN_PATH}/gettaskbyId/${taskId}`,
  createTeam: `${TEAM_PATH}/create-team`,
  updateTeam: `${TEAM_PATH}/update-team`,
  getTeams: `${TEAM_PATH}/get-teams`,
  getTeamsById: (teamCode) => `${TEAM_PATH}/getteamsbyId/${teamCode}`,
  getUsers: `${USER_PATH}/get-user`,
  updateUser: (empID) => `${USER_PATH}/update-user/${empID}`,
  deleteUser: (empID) => `${USER_PATH}/delete-user/${empID}`,
  getUserById: (empID) => `${USER_PATH}/getuserbyId/${empID}`,
};
