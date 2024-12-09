import { SxPropsObject } from '@suid/system/sxProps';

export const globalStyles: Record<string, SxPropsObject> = {
  body: {
    padding: 0,
    margin: 0,

    '::-webkit-scrollbar': {
      display: 'none',
      width: '2px',
      height: '2px',
    },

    '::-webkit-scrollbar-thumb': {
      outline: '1px solid slategrey',
      backgroundColor: 'darkgrey',
    },

    ':not(.user-select)': {
      userSelect: 'none',
    },

    '*': {
      boxSizing: 'border-box',
    },
  },
};
