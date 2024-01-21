import { type ServerResponse, type IncomingMessage } from 'http';

type HandlerFunction = (
  request: IncomingMessage,
  response: ServerResponse,
  callback?: (...args: unknown[]) => void,
) => void;

type HandlerMap = Map<HttpMethod, HandlerFunction | boolean>;

