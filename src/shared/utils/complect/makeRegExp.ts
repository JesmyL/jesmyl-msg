const regs: Record<string, RegExp> = {};
type StrRegExp = `/${string}${string}/${'d' | ''}${'g' | ''}${'i' | ''}${'m' | ''}${'s' | ''}${'u' | ''}${'y' | ''}`;

function makeRegExp(reg: StrRegExp, isResetLastIndex?: boolean) {
  if (regs[reg] === undefined)
    try {
      regs[reg] = new RegExp(reg.slice(1, reg.lastIndexOf('/')), reg.slice(reg.lastIndexOf('/') + 1));
    } catch (e) {
      throw Error(`Incorrect arg passed in ${makeRegExp.name}(${reg})`);
    }

  if (isResetLastIndex === true) regs[reg].lastIndex = 0;

  return regs[reg];
}

export { makeRegExp, type StrRegExp };
