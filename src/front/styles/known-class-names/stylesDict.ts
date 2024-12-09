import { StyledProps } from '@suid/material';

const spacing1 = '8px';
const spacing2 = '16px';

export const knownClassNamesDict = {
  pointer: { cursor: 'pointer' },

  'inline-block': { display: 'inline-block' },

  inline: { display: 'inline' },

  block: { display: 'block' },
  disabled: {
    opacity: '0.5',

    '&:not(.clickable)': {
      pointerEvents: 'none',
    },
  },
  clickable: {},

  ellipsis: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  'white-pre': { whiteSpace: 'pre' },
  'white-pre-children': {
    '> *': {
      whiteSpace: 'pre',
    },
  },
  'white-pre-line': { whiteSpace: 'pre-line' },
  'white-pre-wrap': { whiteSpace: 'pre-wrap' },
  'break-wrap': { wordWrap: 'break-word' },

  nowrap: { whiteSpace: 'nowrap' },

  'break-word': { wordBreak: 'break-word' },

  hidden: { visibility: 'hidden' },

  over: {
    '-hidden': { overflow: 'hidden' },

    '-x-hidden': { overflowX: 'hidden' },

    '-y-hidden': { overflowY: 'hidden' },

    '-visible': { overflow: 'visible' },

    '-x-visible': { overflowY: 'visible' },

    '-y-visible': { overflowY: 'visible' },

    '-auto': {
      maxWidth: '100%',
      maxHeight: '100%',
      overflow: 'auto',
    },

    '-x-auto': {
      maxWidth: '100%',
      overflowX: 'auto',
    },

    '-y-auto': {
      maxHeight: '100%',
      overflowY: 'auto',
    },
  },
  'half-width': { width: '50%' },

  'half-height': { height: '50%' },
  'full-size': {
    height: '100%',
    width: '100%',
  },
  'full-width': { width: '100%' },
  'full-height': { height: '100%' },
  'full-min-width': { minWidth: '100%' },

  'full-min-height': { minHeight: '100%' },

  'full-max-width': { maxWidth: '100%' },

  'full-max-height': { maxHeight: '100%' },

  'vertical-middle': { verticalAlign: 'middle' },

  'show-scrollbar': {
    '&::-webkit-scrollbar': {
      display: 'block',
    },
  },

  margin: {
    '-gap': {
      marginBottom: spacing1,
      marginTop: spacing1,
      marginLeft: spacing1,
      marginRight: spacing1,

      '-b': {
        marginBottom: spacing1,
      },
      '-t': {
        marginTop: spacing1,
      },
      '-v': {
        marginTop: spacing1,
        marginBottom: spacing1,
      },
      '-l': {
        marginLeft: spacing1,
      },
      '-r': {
        marginRight: spacing1,
      },
      '-h': {
        marginRight: spacing1,
        marginLeft: spacing1,
      },
    },
  },

  'vertical-top': { verticalAlign: 'top' },

  'children-middle': {
    '> *': {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
  },

  'display-none': { display: 'none' },

  flex: {
    '': {
      '&:not(.custom-align-items)': {
        alignItems: 'center',
      },
    },

    '+': {
      display: 'flex',
    },

    '-column': {
      '': { flexDirection: 'column' },

      '-reverse': { flexDirection: 'column-reverse' },
    },

    '-max': { width: 'max-content' },

    '-gap': { gap: spacing1 },

    '-wrap': { flexWrap: 'wrap' },
    '-between': { justifyContent: 'space-between' },

    '-around': { justifyContent: 'space-around' },

    '-center': { justifyContent: 'center' },
    '-centered': { justifyContent: 'center', alignItems: 'center' },
    '-middle': { alignItems: 'center' },
    '-start': { justifyContent: 'start' },
    '-end': { justifyContent: 'end' },

    '-items-end': { alignItems: 'end' },
  },
  'custom-align-items': {},

  'inline-flex': { display: 'inline-flex' },

  'pointers-none': { pointerEvents: 'none' },

  'pointers-all': { pointerEvents: 'all' },

  absolute: { position: 'absolute' },

  'full-fill': {
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  },

  relative: { position: 'relative' },

  'margin-auto': { margin: 'auto' },

  'non-overscroll': { overscrollBehavior: 'none' },

  'text-height-block': { height: '1.3em' },

  sticky: {
    position: 'sticky',
    top: '0',
    zIndex: '1',
  },

  inactive: { opacity: '0.7' },

  'no-resize': { resize: 'none' },

  'strong-size': {
    ['--size' as never]: '100px',
    width: 'var(--size)',
    minWidth: 'var(--size)',
    maxWidth: 'var(--size)',
    height: 'var(--size)',
    minHeight: 'var(--size)',
    maxHeight: 'var(--size)',
  },

  text: {
    '-center': { textAlign: 'center' },
    '-right': { textAlign: 'right' },
    '-italic': { fontStyle: 'italic' },
  },
} as const satisfies Record<string, StyledProps>;
