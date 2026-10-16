export function createStrictAttributes(whitelist, entityName = "Entity") {
    return new Proxy(whitelist, {
        get(target, property) {
            if (!(property in target)) {
                throw new Error(
                    `Unknown ${entityName} attribute: "${String(property)}"`
                );
            }

            return target[property];
        }
    });
}