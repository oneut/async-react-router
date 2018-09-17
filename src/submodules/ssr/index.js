import { SSR } from "../dist";

if (process.env.NODE_ENV !== "production") {
  const warn = `Submodules are implemented for compatibility. Therefore, it becomes deprecation. 
The recommendation is as follows.

import { SSR } from "async-react-router";
const router = SSR.createRouter();
const serverRouter = SSR.createServerRouter();`;
  console.warn(warn);
}

export const createRouter = SSR.createRouter;
export const createServerRouter = SSR.createServerRouter;
