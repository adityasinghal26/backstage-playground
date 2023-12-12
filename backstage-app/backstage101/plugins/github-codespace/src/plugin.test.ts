import { githubCodespacesPlugin } from './plugin';

describe('github-codespaces', () => {
  it('should export plugin', () => {
    expect(githubCodespacesPlugin).toBeDefined();
  });
});
