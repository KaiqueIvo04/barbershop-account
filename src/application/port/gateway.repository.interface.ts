/**
 * Interface of the gateway repository
 * Must be implemented by the gateway repository at the infrastructure layer.
 */

export interface IGatewayRepository {

    /**
     * Get a consumer if exists.
     * @param consumer
     */
    getConsumer(email: string)

    /**
     * Create a consumer associated an email and userId.
     * @param email 
     * @param userId 
     */
    createConsumer(email: string, userId: string)

    /**
     * Associate an consumer to group.
     * @param consumerId 
     * @param groupConsumer 
     */
    addConsumerToGroup(consumerId: string, groupConsumer: string)

    /**
     * Associate token a consumer userId.
     * @param consumerId 
     * @param userId 
     */
    addConsumerToken(consumerId: string, userId: string)
    deleteConsumer(email: string)
}
