export function getLocalModuleSpecifierBetweenFileNames(
    importingFile: Pick<SourceFile, "fileName" | "impliedNodeFormat">,
    targetFileName: string,
    compilerOptions: CompilerOptions,
    host: ModuleSpecifierResolutionHost,
    preferences: UserPreferences,
    options: ModuleSpecifierOptions = {},
): string {
    const info = getInfo(importingFile.fileName, host);
    const importMode = options.overrideImportMode ?? importingFile.impliedNodeFormat;
    return getLocalModuleSpecifier(
        targetFileName,
        info,
        compilerOptions,
        host,
        importMode,
        getModuleSpecifierPreferences(preferences, host, compilerOptions, importingFile),
    );
}

function computeModuleSpecifiers(
    modulePaths: readonly ModulePath[],
    compilerOptions: CompilerOptions,
    importingSourceFile: SourceFile | FutureSourceFile,
    host: ModuleSpecifierResolutionHost,
    userPreferences: UserPreferences,
    options: ModuleSpecifierOptions = {},
    forAutoImport: boolean,
): ModuleSpecifierResult {
    const info = getInfo(importingSourceFile.fileName, host);
    const preferences = getModuleSpecifierPreferences(userPreferences, host, compilerOptions, importingSourceFile);
    const existingSpecifier = isFullSourceFile(importingSourceFile) && forEach(modulePaths, modulePath =>
        forEach(
            host.getFileIncludeReasons().get(toPath(modulePath.path, host.getCurrentDirectory(), info.getCanonicalFileName)),
            reason => {
                if (reason.kind !== FileIncludeKind.Import || reason.file !== importingSourceFile.path) return undefined;
                // If the candidate import mode doesn't match the mode we're generating for, don't consider it
                // TODO: maybe useful to keep around as an alternative option for certain contexts where the mode is overridable
                const existingMode = host.getModeForResolutionAtIndex(importingSourceFile, reason.index);
                const targetMode = options.overrideImportMode ?? host.getDefaultResolutionModeForFile(importingSourceFile);
                if (existingMode !== targetMode && existingMode !== undefined && targetMode !== undefined) {
                    return undefined;
                }
                const specifier = getModuleNameStringLiteralAt(importingSourceFile, reason.index).text;
                // If the preference is for non relative and the module specifier is relative, ignore it
                return preferences.relativePreference !== RelativePreference.NonRelative || !pathIsRelative(specifier) ?
                    specifier :
                    undefined;
            },
        ));
    if (existingSpecifier) {
        return { kind: undefined, moduleSpecifiers: [existingSpecifier], computedWithoutCache: true };
    }

    const importedFileIsInNodeModules = some(modulePaths, p => p.isInNodeModules);

    // Module specifier priority:
    //   1. "Bare package specifiers" (e.g. "@foo/bar") resulting from a path through node_modules to a package.json's "types" entry
    //   2. Specifiers generated using "paths" from tsconfig
    //   3. Non-relative specfiers resulting from a path through node_modules (e.g. "@foo/bar/path/to/file")
    //   4. Relative paths
    let nodeModulesSpecifiers: string[] | undefined;
    let pathsSpecifiers: string[] | undefined;
    let redirectPathsSpecifiers: string[] | undefined;
    let relativeSpecifiers: string[] | undefined;
    for (const modulePath of modulePaths) {
        const specifier = modulePath.isInNodeModules
