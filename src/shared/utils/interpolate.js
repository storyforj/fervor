import template from 'es6-template-strings';

export default function interpolate(text, literals) {
  return template(text, literals);
}
