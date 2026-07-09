            // esbuild converts calls to "require" to "__require"; this function
            // calls the real require if it exists, or throws if it does not (rather than
            // throwing an error like "require not defined"). But, since we want typescript
            // to be consumable by other bundlers, we need to convert these calls back to
            // require so our imports are visible again.
            //
            // To fix this, we redefine "require" to a name we're unlikely to use with the
            // same length as "require", then replace it back to "require" after bundling,
            // ensuring that source maps still work.
            //
            // See: https://github.com/evanw/esbuild/issues/1905
            const require = "require";
            const fakeName = "Q".repeat(require.length);
            const fakeNameRegExp = new RegExp(fakeName, "g");
            options.define = { [require]: fakeName };

            // For historical reasons, TypeScript does not set __esModule. Hack esbuild's __toCommonJS to be a noop.
            // We reference `__copyProps` to ensure the final bundle doesn't have any unreferenced code.
            const toCommonJsRegExp = /var __toCommonJS .*/;
            const toCommonJsRegExpReplacement = "var __toCommonJS = (mod) => (__copyProps, mod); // Modified helper to skip setting __esModule.";

            options.plugins = options.plugins || [];
            options.plugins.push(
                {
                    name: "post-process",
                    setup: build => {
                        build.onEnd(async () => {
                            let contents = await fs.promises.readFile(outfile, "utf-8");
                            contents = contents.replace(fakeNameRegExp, require);
                            let matches = 0;
                            contents = contents.replace(toCommonJsRegExp, () => {
                                matches++;
                                return toCommonJsRegExpReplacement;
                            });
                            assert(matches === 1, "Expected exactly one match for __toCommonJS");
                            await fs.promises.writeFile(outfile, contents);
                        });
                    },
                },
            );
        }

        return options;
    });

    return {
        build: async () => esbuild.build(await getOptions()),
        watch: async () => {
            /** @type {esbuild.BuildOptions} */
            const options = { ...await getOptions(), logLevel: "info" };
            if (taskOptions.onWatchRebuild) {
                const onRebuild = taskOptions.onWatchRebuild;
                options.plugins = (options.plugins?.slice(0) ?? []).concat([{
                    name: "watch",
                    setup: build => {
                        let firstBuild = true;
                        build.onEnd(() => {
                            if (firstBuild) {
                                firstBuild = false;
                            }
                            else {
                                onRebuild();
                            }
                        });
                    },
                }]);
            }

            const ctx = await esbuild.context(options);
            ctx.watch();
        },
    };
}
