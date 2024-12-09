import { StyledProps } from '@suid/material';
import { smylib } from '../../../shared/utils';
import { KnownClassNames } from './model';

const styleBlock = document.createElement('style') as HTMLStyleElement;
document.head.appendChild(styleBlock);
const sheet = styleBlock.sheet;

const numericStyleValuesSet = new Set<keyof StyledProps>(['opacity', 'zIndex', 'scale']);

const camelToKebabKey = (key: string) => key.replace(/[A-Z]/g, all => `-${all.toLowerCase()}`);

export const addKnownClassNameStyles = (dict: Record<string, object | string>) => {
  const totalStyles = {} as Record<KnownClassNames, StyledProps>;

  const addStyle = (
    dict: Record<string, object | string>,
    prefix: string,
    parentStrStyles: { styles: string },
    additionals: {},
  ) => {
    smylib.keys(dict).forEach(key => {
      if (typeof dict[key] === 'string') {
        parentStrStyles.styles += `${camelToKebabKey(key)}: ${dict[key]};`;
      } else if (typeof dict[key] === 'number') {
        parentStrStyles.styles += `${camelToKebabKey(key)}: ${dict[key]}${numericStyleValuesSet.has(key as never) ? '' : 'px'};`;
      } else {
        const childStyles = { styles: '' };

        addStyle(dict[key] as never, prefix + key, childStyles, additionals);

        if (childStyles.styles) {
          if (key.includes('&') || key.startsWith('>')) {
            const selector = `${key.startsWith('>') ? '.' + prefix : ''}${key.replace(/&/g, '.' + prefix)}`;

            sheet!.insertRule(`${selector}{${childStyles.styles}}`, sheet!.cssRules.length);

            return;
          }

          const keyName = `${prefix}${key === '+' ? '' : key}`;

          sheet!.insertRule(`.${keyName}{${childStyles.styles}}`, sheet!.cssRules.length);

          const props: Record<string, string | number> = {
            [`--${keyName}_css`]: 'rules',
            ...additionals,
            ...dict[key],
          };
          smylib.keys(props).forEach(propKey => {
            if (propKey.startsWith('--')) return;
            if (propKey.startsWith('-')) delete props[propKey];
          });

          if (key === '+') additionals = { ...additionals, ...dict[key] };

          totalStyles[keyName as never] = props as never;
        } else if (key && !key.startsWith('-')) {
          totalStyles[key as never] = {
            [`--${key}_css`]: 'rules',
            ...((dict[key]['' as never] as {}) ?? dict[key]),
            ...(dict[key]['+' as never] as {}),
          } as never;
        }
      }
    });
  };

  addStyle(dict, '', { styles: '' }, {});

  return totalStyles;
};
