
/**
 * Class with some functions used in some mock classes.
 */
export class DefaultFunctions {
    /**
     * Randomly generates a valid 24-byte hex ID.
     *
     * @return {string}
     */
    public static generateObjectId(): string {
        const chars = 'abcdef0123456789'
        let randS = ''
        for (let i = 0; i < 24; i++) {
            randS += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randS
    }

    /**
     * Randomly generates a number between n and n.
     *
     * @param n
     * @return {number}
     */
    public static generateRandomNumber(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}