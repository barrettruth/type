export function arrayIsEqualTo<T>(
    array1: readonly T[] | undefined,
    array2: readonly T[] | undefined,
    equalityComparer: (a: T, b: T, index: number) => boolean = equateValues,
): boolean {
    if (array1 === undefined || array2 === undefined) {
        return array1 === array2;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (!equalityComparer(array1[i], array2[i], i)) {
            return false;
        }
    }

    return true;
}

export function compact<T>(array: readonly T[]): readonly T[] {
    let result: T[] | undefined;
    if (array !== undefined) {
        for (let i = 0; i < array.length; i++) {
            const v = array[i];
            // Either the result has been initialized (and is looking to collect truthy values separately),
            // or we've hit our first falsy value and need to copy over the current stretch of truthy values.
            if (result ?? !v) {
                result ??= array.slice(0, i);
                if (v) {
                    result.push(v);
                }
            }
        }
    }
    return result ?? array;
}

export function relativeComplement<T>(arrayA: T[] | undefined, arrayB: T[] | undefined, comparer: Comparer<T>): T[] | undefined {
    if (!arrayB || !arrayA || arrayB.length === 0 || arrayA.length === 0) return arrayB;
    const result: T[] = [];
    loopB:
    for (let offsetA = 0, offsetB = 0; offsetB < arrayB.length; offsetB++) {
        if (offsetB > 0) {
            // Ensure `arrayB` is properly sorted.
            Debug.assertGreaterThanOrEqual(comparer(arrayB[offsetB], arrayB[offsetB - 1]), Comparison.EqualTo);
        }

        loopA:
        for (const startA = offsetA; offsetA < arrayA.length; offsetA++) {
            if (offsetA > startA) {
                // Ensure `arrayA` is properly sorted. We only need to perform this check if
                // `offsetA` has changed since we entered the loop.
                Debug.assertGreaterThanOrEqual(comparer(arrayA[offsetA], arrayA[offsetA - 1]), Comparison.EqualTo);
            }

            switch (comparer(arrayB[offsetB], arrayA[offsetA])) {
                case Comparison.LessThan:
                    result.push(arrayB[offsetB]);
                    continue loopB;
                case Comparison.EqualTo:
                    continue loopB;
                case Comparison.GreaterThan:
                    continue loopA;
            }
        }
    }
    return result;
}
