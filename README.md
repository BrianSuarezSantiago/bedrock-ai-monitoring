# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Comandos

```bash
npm create vite@latest my-monitoring-dashboard --template react

npm install

npm install @cloudscape-design/global-styles

npm install @cloudscape-design/components
```

# Infraestructura

Lambda: bedrockLogsReader

CloudWatch Log Group: /aws/bedrock/aimonitoring

API Gateway: bedrockLogBroadcast

DynamoDB table: bedrockLogsConnectionID

https://eu-west-1.signin.aws/platform/d-9367a53821/login?workflowStateHandle=582c6190-8268-4212-8f4a-a36b26c31e7e

