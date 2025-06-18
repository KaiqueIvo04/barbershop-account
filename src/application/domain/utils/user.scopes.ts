export abstract class UsersScopes {

  public static readonly ADMIN: Array<string> = [
    // Usuários
    'ad:c', 'ad:r', 'ad:ra', 'ad:u', 'ad:d',       // CRUD de usuários
    'ad:rp', 'ad:ua', 'ad:uat',                    // Reset de senha, ativar/desativar usuários, autorização

    // Funcionários
    'em:c', 'em:r', 'em:ra', 'em:u', 'em:d',       // CRUD de funcionários
    'em:sc',                                        // Configurar agenda dos funcionários

    // Clientes
    'cl:c', 'cl:r', 'cl:ra', 'cl:u', 'cl:d',       // CRUD de clientes
    'cl:rp',                                        // Reset de senha de clientes

    // Serviços
    'sv:c', 'sv:r', 'sv:ra', 'sv:u', 'sv:d',       // CRUD de serviços oferecidos
    'sv:p',                                         // Definir preços dos serviços

    // Agendamentos de serviços
    'sc:c', 'sc:r', 'sc:ra', 'sc:u', 'sc:d',       // CRUD de agendamentos de serviços
    'sc:us',                                        // Atualizar status dos agendamentos de serviços
    'sc:re',                                        // Relatórios de agendamentos de serviços

    // Agendamentos de trabalho
    'ws:c', 'ws:r', 'ws:ra', 'ws:u', 'ws:d',       // CRUD de agendamentos de trabalho
    'ws:us',                                        // Atualizar status dos agendamentos de trabalho
    'ws:re',                                        // Relatórios de agendamentos de trabalho
  ]

  public static readonly CLIENT: Array<string> = [
    // Usuário
    'us:rp',                                        // Reset da própria senha
    'cl:r', 'cl:u',                                 // Ler e atualizar próprio perfil

    // Serviços
    'sv:r', 'sv:ra',                                // Ver serviços disponíveis

    // Agendamentos de serviços
    'sc:c', 'sc:r',                                 // Criar e ler agendamentos de serviços

    // Agendamentos de trabalho
    'ws:r', 'ws:ra',                                // Ver agendamentos de trabalho dos funcionários
  ]

  public static readonly EMPLOYEE: Array<string> = [
    // Usuário
    'us:rp',                                        // Reset da própria senha
    'em:r', 'em:u',                                 // Ler e atualizar próprio perfil

    // Clientes
    'cl:c', 'cl:r', 'cl:ra', 'cl:u',                // Criar, ler e atualizar clientes (sem delete)

    // Serviços
    'sv:r', 'sv:ra',                                // Ver serviços disponíveis

    // Agendamentos de serviços
    'sc:r', 'sc:u', 'sc:d',                         // Ler, atualizar e deletar agendamentos de serviços

    // Agendamentos de trabalho
    'ws:r', 'ws:ra',                                // Ver agendamentos de trabalho dos funcionários
  ]

  public static getUserScopes(type: string): Array<string> {
    return {
      admin: () => UsersScopes.ADMIN,
      client: () => UsersScopes.CLIENT,
      employee: () => UsersScopes.EMPLOYEE
    }[type]()
  }
}
