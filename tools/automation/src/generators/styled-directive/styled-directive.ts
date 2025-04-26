import {
  formatFiles,
  generateFiles,
  names,
  readJson,
  Tree,
  updateJson,
} from '@nx/devkit';
import * as path from 'path';
import { StyledDirectiveGeneratorSchema } from './schema';

export async function styledDirectiveGenerator(
  tree: Tree,
  options: StyledDirectiveGeneratorSchema
) {
  const resolvedOptions = {
    ...options,
    className: names(options.name).className,
    importPath: options['import-path'],
    element: options['element'],
    scope: readJson(tree, 'package.json').name,
  };

  const projectRoot = `libs/ui/components/${resolvedOptions.name}`;

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    projectRoot,
    resolvedOptions
  );

  updateJson(tree, 'tsconfig.base.json', (json) => {
    const indexPath = `${projectRoot}/src/index.ts`;
    json.compilerOptions.paths[resolvedOptions.importPath] = [indexPath];
    return json;
  });

  await formatFiles(tree);
}

export default styledDirectiveGenerator;
