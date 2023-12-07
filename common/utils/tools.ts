/**
 * 生成BEM规范的className
 * @param {string} block
 * @param {string} ele
 * @param {string} modify
 * @returns string
 */
export const genBem = (block?: string, ele?: string, modify?: string) => {
  let bem = `${block}`;
  if (ele) {
    bem += `__${ele}`;
  }
  if (modify) {
    bem += `--${modify}`;
  }
  return bem;
};