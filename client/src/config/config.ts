interface IConfig {
  apiBaseUrl: string;
}

const config: IConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
};

export default config;
