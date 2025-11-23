import React, { ReactNode } from 'react';

const DocList = ({ children }: { children: ReactNode }) => {
  console.log('This is rendered from server');
  return <div>{children}</div>;
};

export default DocList;
