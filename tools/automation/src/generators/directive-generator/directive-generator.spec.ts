import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { directiveGeneratorGenerator } from './directive-generator';
import { DirectiveGeneratorGeneratorSchema } from './schema';

describe('directive-generator generator', () => {
  let tree: Tree;
  const options: DirectiveGeneratorGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await directiveGeneratorGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
