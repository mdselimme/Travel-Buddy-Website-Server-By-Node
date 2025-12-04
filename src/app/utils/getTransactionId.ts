


export const getTransactionId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomString}`.toUpperCase();
};
