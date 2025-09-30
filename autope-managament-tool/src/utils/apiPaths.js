// all the paths of api defined here
// const env = prod;
// BASE URL IN THE ENV
const ACTIVE_ENVIRONMENT = "staging";
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
  return `${base}${portString}/${service}/${version}`;
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
  ACTIVE_CONFIG.auth_port,
  "auth",
  ACTIVE_CONFIG.versions.auth
);

export const apiPaths = {
  updateUser: `${EXTERNAL_PATH}/user/update-user`,
};
