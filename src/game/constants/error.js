export const FAILED_TO_FETCH_MANIFEST = (url) => `Failed to fetch manifest.json from ${url}`
export const NOT_IMPLEMENTED = (className, methodName) => `${className} must implement ${methodName}`
export const INVALID_ARGUMENT = (className, argumentName) => `${className}: Invalid or missing argument '${argumentName}'`
export const CONTAINER_ALREADY_EXISTS = (containerName) => `Container ${containerName} already exists`
export const CONTAINER_DOES_NOT_EXIST = (containerName) => `Container ${containerName} does not exist`

export const NOT_INITIALIZED = (className) => `${className} not initialized yet`
export const IS_SINGLETON = (className) => `${className} is a singleton. Use ${className}.getInstance`
