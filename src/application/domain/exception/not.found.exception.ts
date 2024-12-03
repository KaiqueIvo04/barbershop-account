import { Exception } from './exception'

/**
 * Not found exception.
 *
 * @extends {Exception}
 */
export class NotFoundException extends Exception {
    /**
     * Creates an instance of NotFoundException.
     *
     * @param message Short message
     * @param description Detailed message
     */
    constructor(message: string, description?: string) {
        super(message, description)
    }
}