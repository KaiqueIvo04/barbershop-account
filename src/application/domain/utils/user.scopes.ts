export abstract class UsersScopes {

  public static readonly ADMIN: Array<string> = [
    // Usuários
    'us:c', 'us:r', 'us:ra', 'us:u', 'us:d',       // CRUD de usuários
    'us:rp', 'us:ua', 'us:uat',                    // Reset de senha, ativar/desativar usuários, autorização

    // Funcionários
    'em:c', 'em:r', 'em:ra', 'em:u', 'em:d',       // CRUD de funcionários
    'em:sc',                                        // Configurar agenda dos funcionários

    // Clientes
    'cl:c', 'cl:r', 'cl:ra', 'cl:u', 'cl:d',       // CRUD de clientes
    'cl:rp',                                        // Reset de senha de clientes

    // Serviços
    'sv:c', 'sv:r', 'sv:ra', 'sv:u', 'sv:d',       // CRUD de serviços oferecidos
    'sv:p',                                         // Definir preços dos serviços

    // Agendamentos
    'ap:c', 'ap:r', 'ap:ra', 'ap:u', 'ap:d',       // CRUD de agendamentos
    'ap:us',                                        // Atualizar status dos agendamentos
    'ap:re',                                        // Relatórios de agendamentos

    // Produtos
    'pr:c', 'pr:r', 'pr:ra', 'pr:u', 'pr:d',       // CRUD de produtos
    'pr:s', 'pr:st',                                // Vendas e controle de estoque
  ]

  public static readonly CLIENT: Array<string> = [
    // Usuário
    'us:rp',                                        // Reset da própria senha
    'cl:r', 'cl:u',                                 // Ler e atualizar próprio perfil

    // Serviços
    'sv:r', 'sv:ra',                                // Ver serviços disponíveis

    // Agendamentos
    'ap:c', 'ap:r', 'ap:u', 'ap:d',                // CRUD dos próprios agendamentos
    'ap:em',                                        // Ver disponibilidade dos funcionários para agendamento

    // Produtos
    'pr:r', 'pr:ra',                                // Ver produtos disponíveis
    'pr:p',
  ]

  public static readonly EMPLOYEE: Array<string> = [
    // Usuário
    'us:rp',                                        // Reset da própria senha
    'em:r', 'em:u',                                 // Ler e atualizar próprio perfil

    // Clientes
    'cl:c', 'cl:r', 'cl:ra', 'cl:u',                // Criar, ler e atualizar clientes (sem delete)

    // Serviços
    'sv:r', 'sv:ra',                                // Ver serviços disponíveis

    // Agendamentos
    'ap:c', 'ap:r', 'ap:ra', 'ap:u',                // Criar, ler e atualizar agendamentos (sem delete)
    'ap:us',                                        // Atualizar status dos agendamentos (iniciado, concluído)
    'ap:em',                                        // Ver própria agenda/disponibilidade

    // Produtos
    'pr:r', 'pr:ra',                                // Ver produtos disponíveis
    'pr:s',
  ]

  public static getUserScopes(type: string): Array<string> {
    return {
      admin: () => UsersScopes.ADMIN,
      client: () => UsersScopes.CLIENT,
      employee: () => UsersScopes.EMPLOYEE
    }[type]()
  }
}
