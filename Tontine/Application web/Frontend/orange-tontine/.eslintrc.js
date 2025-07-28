module.exports = {
    root: true,
    extends: ['react-app'],
    settings: {
      react: {
        version: 'detect' // Laisse ESLint détecter la version de React
      }
    },
    rules: {
      // Si vous aviez des règles spécifiques à désactiver, mettez-les ici
      // Exemple: 'react/react-in-jsx-scope': 'off' si nécessaire pour d'anciennes versions de React
    }
  };