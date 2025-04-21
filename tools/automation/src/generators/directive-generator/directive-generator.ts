import {
  formatFiles,
  generateFiles,
  names,
  readJson,
  Tree,
  updateJson,
} from '@nx/devkit';
import * as path from 'path';
import { DirectiveGeneratorGeneratorSchema } from './schema';

export async function directiveGeneratorGenerator(
  tree: Tree,
  options: DirectiveGeneratorGeneratorSchema
) {
  const resolvedOptions = {
    ...options,
    name: names(options.name).fileName,
    fileName: names(options.name).fileName,
    className: names(options.name).className,
    constantName: names(options.name).constantName,
    element: options['element'],
    importPath: options['import-path'],
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

export default directiveGeneratorGenerator;
