// Mock SearchContextProvider for development
// This will be replaced by @backstage/plugin-search-react in production

import React from 'react';

export const SearchContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};
