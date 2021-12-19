import assertIsDefined from "./assertIsDefined";

type CredentialsTokyo42 = {
  name: string;
  password: string;
};

type CredentialsDiscord = {
  email: string;
  password: string;
};

type Credentials = {
  tokyo42: CredentialsTokyo42;
  discord: CredentialsDiscord;
};

const setCredentials = (envVars: NodeJS.ProcessEnv) => {
  assertIsDefined(envVars.TOKYO_42_USERNAME);
  assertIsDefined(envVars.TOKYO_42_PASSWORD);
  assertIsDefined(envVars.DISCORD_EMAIL);
  assertIsDefined(envVars.DISCORD_PASSWORD);

  const credentials: Credentials = {
    tokyo42: {
      name: envVars.TOKYO_42_USERNAME,
      password: envVars.TOKYO_42_PASSWORD,
    },
    discord: {
      email: envVars.DISCORD_EMAIL,
      password: envVars.DISCORD_PASSWORD,
    },
  };

  return credentials;
};

export { setCredentials, CredentialsTokyo42, CredentialsDiscord, Credentials };
