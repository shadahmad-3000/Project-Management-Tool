// all the paths of api defined here
// const env = prod;
// BASE URL IN THE ENV
const PROD_BASE_URL = "https://dmrc.autope.in";

// const metroPath = 3008;
const STAGING_BASE_URL = "http://35.200.205.29:3000";

const externalPath = `${STAGING_BASE_URL}/externalPath/`;

export const apiPaths = {
  updateUser: `${externalPath}/user/update-user`,
};
