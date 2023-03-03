import { PERMISSION_INDEX } from 'config/data-label';

export function getPermissionList(data) {
  return {
    titlePage: {
      ...(data.find((item) => item.code === PERMISSION_INDEX.button_export) || {}),
      name: 'Permission Index',
    },
  };
}
