
export const firstLetterUppercase = (value) => {
  if (!value) return '';

  const str = value.toString();
  return `${ str.substr(0,1).toUpperCase() }${ str.substr(1, str.length).toLowerCase() }`
}