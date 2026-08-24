import { getConvexAuthProviders } from "./lib/authConfigPolicy";

const authConfig = {
  providers: getConvexAuthProviders(),
};

export default authConfig;
