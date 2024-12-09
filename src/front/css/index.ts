import { styled as suidStyled } from '@suid/material';
import { smylib } from '../../shared/utils';

const stylesSet = new Set<string>();
const dynamicsMap = new Map<string, DynamicClassName>();
const styleBlock = document.createElement('style') as HTMLStyleElement;
document.head.appendChild(styleBlock);
const sheet = styleBlock.sheet;

class StaticClassName {
  constructor(private hashedClassName: string) {}
  toString = () => this.hashedClassName;
}

class DynamicClassName {
  constructor(
    public hashedClassName: string,
    public uniquePrefix: string,
    public staticsClassName: string,
    public additionalClassName: string | und,
    public styleContent: string,
  ) {}

  toString = () =>
    this.uniquePrefix +
    ' ' +
    this.hashedClassName +
    this.staticsClassName +
    (this.additionalClassName === undefined ? '' : ' ' + this.additionalClassName);

  getStyleContent() {
    return `.${this.uniquePrefix}.${this.hashedClassName}{${this.styleContent}}`;
  }
}

class KeyFrames {
  constructor(private hashedClassName: string) {}
  toString = () => this.hashedClassName;
}

const styledBuilder =
  (uniquePrefix: string, addClassName?: string) =>
  (...arr: any[]): string => {
    let styleStr = '';
    let staticClassNames = '';

    for (let i = 0; i < arr.length; i++) {
      styleStr += arr[0][i];

      if (arr[i + 1] instanceof StaticClassName) {
        staticClassNames += ' ' + arr[i + 1];
        continue;
      }

      // if (arr[i + 1] instanceof DynamicClassName) {
      //   classNames += ' ' + arr[i + 1];
      //   continue;
      // }

      if (arr[i + 1] !== undefined) styleStr += arr[i + 1];
    }

    const hash = 'd_' + smylib.md5(styleStr);
    const prev = dynamicsMap.get(hash);

    if (prev !== undefined) return prev as never as string;

    const content = new DynamicClassName(hash, uniquePrefix, staticClassNames, addClassName, styleStr);
    dynamicsMap.set(hash, content);

    sheet!.insertRule(content.getStyleContent(), sheet!.cssRules.length);

    return content as never as string;
  };

export const styler = suidStyled;

export const styled = import.meta.env.DEV
  ? (uniquePrefix: string, addClassName?: string) => {
      if (!uniquePrefix.match(/^[a-z0-9][a-z0-9_-]*[a-z0-9]$/i))
        throw new Error(`"${uniquePrefix}" - Не корректное уникальное название для стилей`);
      return styledBuilder(uniquePrefix, addClassName);
    }
  : styledBuilder;

export const keyframes = (...arr: any[]): KeyFrames => {
  let styleStr = '';

  for (let i = 0; i < arr.length; i++) {
    styleStr += arr[0][i];
    if (arr[i + 1] !== undefined) styleStr += arr[i + 1];
  }

  const hash = 'k_' + smylib.md5(styleStr);
  const styleRuleStr = `@keyframes ${hash}{${styleStr}}`;

  sheet!.insertRule(styleRuleStr.toString(), sheet!.cssRules.length);

  return new KeyFrames(hash);
};

export const createGlobalStyle = (...arr: any[]) => {
  let styleStr = '';

  for (let i = 0; i < arr.length; i++) {
    styleStr += arr[0][i];
    if (arr[i + 1] !== undefined) styleStr += arr[i + 1];
  }

  sheet!.insertRule(`:root{${styleStr}}`, sheet!.cssRules.length);

  return (props: { children?: any }) => props.children;
};

// export const css = (...arr: any[]): StaticClassName => {
//     let styleStr = '';

//     for (let i = 0; i < arr.length; i++) {
//       styleStr += arr[0][i];
//       if (arr[i + 1] !== undefined) styleStr += arr[i + 1];
//     }

//     const hash = 's_' + smylib.md5(styleStr);
//     const styleRuleStr = `.${hash}{${styleStr}}`;

//     sheet!.insertRule(styleRuleStr.toString(), sheet!.cssRules.length);

//     return new StaticClassName(hash);
//   };

export const css = (...arr: any[]): string => {
  let styleStr = '';

  for (let i = 0; i < arr.length; i++) {
    styleStr += arr[0][i];
    if (arr[i + 1] !== undefined) styleStr += arr[i + 1];
  }

  return styleStr;
};
