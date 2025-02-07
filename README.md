### Example Workflow

1. **Define or Update Schema**: Modify the `schema.prisma` file to change your database structure.
2. **Create Migrations**: Use Prisma to generate and apply migrations.
3. **Run Docker Compose**: Build and run the Node.js app and PostgreSQL using Docker Compose.
4. **Interact with the API**: Use the frontend or API client (e.g., Postman) to register, login, and manage todos.

## Getting Started with Docker Container

1. **Generate the Prisma Client**: 

    `npx prisma generate`

2. **Build your docker images**: 

    `docker compose build`

3. **Create PostgreSQL migrations and apply them**: 

    `docker compose run app npx prisma migrate dev --name init`

4. **Boot up 2x docker containers**: 

    `docker compose --env-file .env up`