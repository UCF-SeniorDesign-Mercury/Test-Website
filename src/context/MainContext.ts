import { createContext } from 'react';

const mainContext = createContext({
  var1: undefined as unknown as null | string,
  var2: 'this is var 2',
  login: undefined as unknown as null | ((value: string) => void),
  logout: undefined as unknown as null | (() => void),
});

export default mainContext;
