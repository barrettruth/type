export function getModuleSpecifiers(
    moduleSymbol: Symbol,
    checker: TypeChecker,
    compilerOptions: CompilerOptions,
    importingSourceFile: SourceFile,
    host: ModuleSpecifierResolutionHost,
    userPreferences: UserPreferences,
    options: ModuleSpecifierOptions = {},
): readonly string[] {
    return getModuleSpecifiersWithCacheInfo(
        moduleSymbol,
        checker,
        compilerOptions,
        importingSourceFile,
        host,
        userPreferences,
        options,
        /*forAutoImport*/ false,
    ).moduleSpecifiers;
}

/** @internal */
export interface ModuleSpecifierResult {
    kind: ResolvedModuleSpecifierInfo["kind"];
    moduleSpecifiers: readonly string[];
    computedWithoutCache: boolean;
}

/** @internal */
export function getModuleSpecifiersWithCacheInfo(
    moduleSymbol: Symbol,
    checker: TypeChecker,
    compilerOptions: CompilerOptions,
    importingSourceFile: SourceFile | FutureSourceFile,
    host: ModuleSpecifierResolutionHost,
    userPreferences: UserPreferences,
    options: ModuleSpecifierOptions | undefined = {},
    forAutoImport: boolean,
): ModuleSpecifierResult {
    let computedWithoutCache = false;
    const ambient = tryGetModuleNameFromAmbientModule(moduleSymbol, checker);
    if (ambient) {
        return {
            kind: "ambient",
            moduleSpecifiers: !(forAutoImport && isExcludedByRegex(ambient, userPreferences.autoImportSpecifierExcludeRegexes)) ? [ambient] : emptyArray,
            computedWithoutCache,
        };
    }

    // eslint-disable-next-line prefer-const
    let [kind, specifiers, moduleSourceFile, modulePaths, cache] = tryGetModuleSpecifiersFromCacheWorker(
        moduleSymbol,
        importingSourceFile,
        host,
        userPreferences,
        options,
    );
    if (specifiers) return { kind, moduleSpecifiers: specifiers, computedWithoutCache };
    if (!moduleSourceFile) return { kind: undefined, moduleSpecifiers: emptyArray, computedWithoutCache };

    computedWithoutCache = true;
    modulePaths ||= getAllModulePathsWorker(getInfo(importingSourceFile.fileName, host), moduleSourceFile.originalFileName, host, compilerOptions, options);
    const result = computeModuleSpecifiers(
        modulePaths,
        compilerOptions,
        importingSourceFile,
        host,
        userPreferences,
        options,
        forAutoImport,
    );
    cache?.set(importingSourceFile.path, moduleSourceFile.path, userPreferences, options, result.kind, modulePaths, result.moduleSpecifiers);
    return result;
}
