export class StrUtils {
    /**
     * Remove html tags.
     *
     * @param str
     */
    public static stripHtml(str?: string): string | undefined {
        return str ? str.toString().replace(/<[^>]*>/igm, '') : str
    }
}
