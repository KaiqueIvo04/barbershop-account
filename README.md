# Barbershop Account Microservice

The Barbershop Account Microservice is a component of the Barbershop platform, responsible for managing and authenticating all users, including administrators, clients, and employees. This microservice provides a secure and reliable way to handle user data, authentication, and authorization.

## Main Features

*   **User Management:** Create, retrieve, update, and delete users (Admins, Clients, and Employees).
*   **Authentication of users:** Secure user authentication using JSON Web Tokens (JWT).
*   **Authorization:** Role-based access control to protect different parts of the application.
*   **Event-Driven Architecture:** Communicates with other microservices through RabbitMQ to ensure loose coupling and scalability.
*   **Domain-Driven Design (DDD):** Built with a clean and maintainable architecture that separates business logic from infrastructure concerns.

## Technology Stack

*   **[Node.js](https://nodejs.org/)**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **[Express](https://expressjs.com/)**: A fast, unopinionated, minimalist web framework for Node.js.
*   **[MongoDB](https://www.mongodb.com/)**: A general-purpose, document-based, distributed database.
*   **[RabbitMQ](https://www.rabbitmq.com/)**: An open-source message broker.
*   **[Docker](https.docker.com)**: A platform for developing, shipping, and running applications in containers.
*   **[InversifyJS](http://inversify.io/)**: A powerful and lightweight inversion of control (IoC) container for TypeScript and JavaScript.

## Architecture

This microservice is built using the principles of **Domain-Driven Design (DDD)**. The code is organized into four main layers:

*   **`ui`**: The presentation layer, responsible for handling HTTP requests and responses. It contains the Express controllers.
*   **`application`**: The application layer, which orchestrates the business logic. It contains the application services and interfaces.
*   **`domain`**: The domain layer, which contains the core business logic and data models.
*   **`infrastructure`**: The infrastructure layer, which handles external concerns like database connections, message queues, and other third-party integrations.

Here is a high-level diagram of the architecture:

```
+-----------------+      +-----------------+      +--------------------+
|   UI Layer      |----->| Application Layer |----->|   Domain Layer     |
| (Controllers)   |      | (Services)      |      | (Models, Entities) |
+-----------------+      +-----------------+      +--------------------+
        |                      |                      |
        |                      |                      |
        v                      v                      v
+----------------------------------------------------------------------+
|                        Infrastructure Layer                            |
| (MongoDB, RabbitMQ, etc.)                                            |
+----------------------------------------------------------------------+
```

## API Endpoints

Here is a list of the available API endpoints:

### Authentication

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| `POST` | `/v1/auth`        | Authenticate a user       |
| `POST` | `/v1/auth/register`| Register a new client user |

### Admins

| Method  | Endpoint               | Description                  |
| ------- | ---------------------- | ---------------------------- |
| `POST`  | `/v1/admins`           | Create a new admin user      |
| `GET`   | `/v1/admins`           | Get all admin users          |
| `GET`   | `/v1/admins/:admin_id` | Get an admin user by ID      |
| `PATCH` | `/v1/admins/:admin_id` | Update an admin user by ID   |

### Clients

| Method   | Endpoint                 | Description                    |
| -------- | ------------------------ | ------------------------------ |
| `POST`   | `/v1/clients`            | Create a new client user       |
| `GET`    | `/v1/clients`            | Get all client users           |
| `GET`    | `/v1/clients/:client_id` | Get a client user by ID        |
| `PATCH`  | `/v1/clients/:client_id` | Update a client user by ID     |
| `DELETE` | `/v1/clients/:client_id` | Delete a client user by ID     |

### Employees

| Method   | Endpoint                   | Description                      |
| -------- | -------------------------- | -------------------------------- |
| `POST`   | `/v1/employees`            | Create a new employee user       |
| `GET`    | `/v1/employees`            | Get all employee users           |
| `GET`    | `/v1/employees/:employee_id`| Get an employee user by ID     |
| `PATCH`  | `/v1/employees/:employee_id`| Update an employee user by ID  |
| `DELETE` | `/v1/employees/:employee_id`| Delete an employee user by ID  |

### Users

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| `GET`  | `/v1/users` | Get all users (any type) |


## Getting Started

To get the project up and running on your local machine, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/en/download/) (v14.16.0 or higher)
*   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)

## Generate Certificates and Keys
1. For development and testing environments the easiest and fastest way is to generate your own self-signed certificates. To do this, run the `generate-dev-certs.sh` script in the root of the repository.
```sh
chmod +x ./generate-dev-certs.sh
```

```sh
./generate-dev-certs.sh
```
The following files will be created: `ca_cert.pem`, `jwt.key`, `jwt.key.pub`, `server_cert.pem` and `server_key.pem`.

2. For generation mongodb encrypt key run: 
```sh
chmod +x ./generate-db-keys.sh
```

```sh
./generate-db-keys.sh
```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/KaiqueIvo04/barbershop-account.git
    cd barbershop-account
    ```

2.  **Create a `.env` file:**

    Copy the `.env.example` file to a new file named `.env`.

    ```bash
    cp .env.example .env
    ```

    Update the environment variables in the `.env` file as needed.

3.  **Install dependencies:**

    ```bash
    npm install
    ```

## Running the Application

You can run the application using Docker Compose, which will start the microservice along with its dependencies (MongoDB and RabbitMQ).

```bash
docker-compose up --build -d
```

The microservice will be available at `https://localhost:3001`.

## Running Tests

To run the test suite, use the following command:

*   **Unit Tests:** `npm run test:unit`

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Create a pull request to the `master` branch of the original repository.

Please make sure that your code follows the existing coding style and that all tests pass before submitting a pull request.
