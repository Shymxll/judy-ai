// postcss.config.js
module.exports = {
  plugins: {
    // 'tailwindcss': {}, // Eski veya yanlış yapılandırma
    '@tailwindcss/postcss': {}, // Güncel ve doğru yapılandırma
    'autoprefixer': {},
    // ...diğer PostCSS eklentileriniz
  }
}