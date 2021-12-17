import { createContext } from 'react';

const mainContext = createContext({
  var1: null,
  var2: 'this is var 2',
  login: null as any,
  logout: null as any,
});

export default mainContext;
