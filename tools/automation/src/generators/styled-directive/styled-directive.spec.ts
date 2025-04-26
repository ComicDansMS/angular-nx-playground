import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { styledDirectiveGenerator } from './styled-directive';
import { StyledDirectiveGeneratorSchema } from './schema';

describe('styled-directive generator', () => {
  let tree: Tree;
  const options: StyledDirectiveGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await styledDirectiveGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
