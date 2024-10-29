export abstract class UsersScopes {

    public static readonly ADMIN: Array<string> = []
  
    public static readonly CLIENT: Array<string> = []

    public static readonly EMPLOYEE: Array<string> = []
  
    public static getUserScopes(type: string): Array<string> {
      return {
        admin: () => UsersScopes.ADMIN,
        client: () => UsersScopes.CLIENT,
        employee: () => UsersScopes.EMPLOYEE
      }[type]()
    }
  }