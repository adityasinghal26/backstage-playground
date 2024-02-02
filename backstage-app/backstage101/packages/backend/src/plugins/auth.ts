import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,

      // This replaces the default GitHub auth provider with a customized one.
      // The `signIn` option enables sign-in for this provider, using the
      // identity resolution logic that's provided in the `resolver` callback.
      //
      // This particular resolver makes all users share a single "guest" identity.
      // It should only be used for testing and trying out Backstage.
      //
      // If you want to use a production ready resolver you can switch to
      // the one that is commented out below, it looks up a user entity in the
      // catalog using the GitHub username of the authenticated user.
      // That resolver requires you to have user entities populated in the catalog,
      // for example using https://backstage.io/docs/integrations/github/org
      //
      // There are other resolvers to choose from, and you can also create
      // your own, see the auth documentation for more details:
      //
      //   https://backstage.io/docs/auth/identity-resolver
      github: providers.github.create({
        signIn: {
          resolver: async (info, ctx) => {
            const { profile } = info;
            const { email } = profile;
            if (!email) {
              throw new Error('User profile contained no email');
            }

            // Split the email into the local part and the domain.
            const [name, domain] = email.split('@');

            // Next we verify the email domain. It is recommended to include this
            // kind of check if you don't look up the user in an external service.
            if (domain !== 'gmail.com') {
              throw new Error(
                `Login failed, this email ${email} does not belong to the expected domain`,
              );
            }

            // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
            return ctx.signInWithCatalogUser({
              entityRef: { name },
            });
          },
          // resolver: providers.github.resolvers.usernameMatchingUserEntityName(),
        },
      }),
    },
  });
}
