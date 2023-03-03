import React from 'react';

export function ButtonPermission(props) {
  const { component: Component, permission } = props;
  if (permission)
    return (
      <>
        <Component {...props} />
      </>
    );
  return null;
}
