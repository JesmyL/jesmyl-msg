export const escapeText = (text: string) =>
  text.replace(/(%[0-9a-f]{2})+/gi, a => {
    try {
      return decodeURIComponent(a);
    } catch (e) {
      return a;
    }
  });

////////////////////////////////////////////////
////////////////////////////////////////////////
// #region mini funcs
////////////////////////////////////////////////
////////////////////////////////////////////////

export const itIt = <It>(it: It) => it;
export const itNIt = <It>(it: It) => !it;
export const isNIs = (is: boolean) => !is;
export const emptyFunc = () => {};
export const retUnd = () => undefined;
export const itNUnd = <It>(it: It) => it !== undefined;
export const retNull = () => null;
export const itNNull = <It>(it: It) => it !== null;
export const itNNil = <It>(it: It) => it != null;
export const itNNaN = (it: number) => !isNaN(it);
