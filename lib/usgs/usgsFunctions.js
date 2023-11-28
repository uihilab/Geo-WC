export function hasMajorFilter(args, caseSensitive = false) {
    const majorFilters = ['site', 'sites', 'stateCd', 'huc', 'bBox', 'counties', 'countyCd'];

    // Check if any of the major filters exists in the args object
    const hasMajorFilter = majorFilters.some(filter => {
        if (caseSensitive) {
            return args.hasOwnProperty(filter);
        } else {
            // Convert both filter and argument key to lowercase for case-insensitive comparison
            const lowerCaseFilter = filter.toLowerCase();
            return Object.keys(args).some(argKey => argKey.toLowerCase() === lowerCaseFilter);
        }
    });

    return hasMajorFilter;
}
