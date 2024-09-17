# ChatApp Vercel-D

[![ChatApp Logo](link-to-logo.png)](link-to-project-website) 

**Build a powerful and scalable chat application with real-time updates, AI-powered responses, and seamless integration with Azure OpenAI Service.**

## Key Features

- **Real-time Chat:** Provide instant messaging capabilities using Pusher for seamless communication.
- **AI-Powered Responses:** Integrate intelligent responses using Azure OpenAI Service to engage users.
- **Persistent Conversations:** Store and retrieve conversation history in MongoDB for continuity.
- **Customizable AI (Optional):**  Fine-tune AI behavior with few-shot learning for tailored responses.
- **File Analysis:**  Enable users to upload files for analysis (implementation details can be customized).
- **Conversation Search:** Allow users to easily search through past conversations.
- **Easy Deployment:** Deploy effortlessly to Vercel with automatic build and deployment processes.
- **Centralized Error Handling:** Implement consistent error handling across all API routes for improved reliability and debugging.

## Screenshots

(Optional: Include 1-2 compelling screenshots of your application here)

## Documentation

For more detailed information on the frontend and backend implementations, please refer to the following documentation:

- **Frontend Documentation:** [FRONTEND.md](FRONTEND.md)
- **Backend Documentation:** [BACKEND.md](BACKEND.md)

## Setup Instructions

**1. Clone the repository:**

```bash
git clone [repository-url]
cd chatapp-vercel-d
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up environment variables:**

- Create a `.env.local` file in both the `apps/frontend` and `apps/backend` directories.
- Copy the contents of the respective `.env.example` files and fill in your actual values.

**4. Run the development server:**

```bash
npm run dev
```

This will start both the frontend and backend servers concurrently with hot reloading. You should see the chat application running in your browser at `http://localhost:3000`.

## Development Workflow

- **Start Development Servers:** `npm run dev` (starts both frontend and backend servers with hot reloading).
- **Frontend Development:** Make changes in the `apps/frontend/src` directory.
- **Backend Development:** Modify API routes in `apps/backend/pages/api` or utility functions in `apps/backend/utility`.
- **Run Linters:** `npm run lint` (ensures code quality and consistency).
- **Run Tests:** `npm run test` (executes unit and integration tests).

## Deployment

This project is configured for deployment on Vercel.

1. **Push your changes to the connected Git repository.**
2. **Vercel will automatically detect the pushed changes and start the deployment process.**
3. **Ensure all necessary environment variables are set in the Vercel project settings.**

## Environment Setup

1. **Backend Configuration**

   - Create a `.env.local` file in the root directory of the backend (`apps/backend`).
   - Copy the contents of `.env.example` and fill in your actual values.

2. **Frontend Configuration**

   - Create a `.env.local` file in the root directory of the frontend (`apps/frontend`).
   - Copy the contents of `.env.example` and fill in your actual values.

**Environment Variables Description**

- `AZURE_OPENAI_ENDPOINT`: The endpoint URL for your Azure OpenAI resource.
- `AZURE_OPENAI_API_KEY`: The API key for accessing Azure OpenAI services.
- `JWT_SECRET`: Secret key used for signing JWT tokens (keep this secure).
- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`: Credentials for Pusher real-time communication.
- `DATABASE_URL`: Connection string for your database (if applicable).
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API.
- `NEXT_PUBLIC_PUSHER_KEY`: Pusher public key for the frontend.
- `NEXT_PUBLIC_PUSHER_CLUSTER`: Pusher cluster for the frontend.

## Error Handling

The backend implements a centralized error handling mechanism using the `apiHandler` utility. This ensures consistent error responses across all API routes and simplifies error management.

Key features of the error handling system:
- Wraps all API route handlers to catch and process errors uniformly.
- Automatically sends appropriate HTTP status codes and error messages.
- Logs errors for debugging purposes.

To throw an error in an API route, use the following format:
```javascript
throw { statusCode: 400, message: 'Error message here' };
```

The `apiHandler` will catch this error and send a properly formatted response to the client.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
