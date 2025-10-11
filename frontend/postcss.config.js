// Usa 'import' en lugar de 'require'
import stack from 'postcss-stack';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Usa 'export default' en lugar de 'module.exports'
export default {
  plugins: [
    stack({
      list: [
        { 'beneath': -1 },
        'application',
        'tool-tip',
        'modal'
      ]
    }),
    tailwindcss(),
    autoprefixer()
  ]
};