declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /* eslint camelcase: "off" */
      items_api_key_stage: string;
      items_api_key_prod: string;
    }
  }
}

export {};
