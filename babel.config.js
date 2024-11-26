module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-reanimated/plugin'],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@assets': './src/assets',  // Added './' for relative path
          '@typescript': './src/typescript',
          '@validations': './src/lib/validations',
          '@components': './src/lib/components',
          '@utils': './src/utils',
          '@hooks': './src/data/hooks',
          "@redux": './src/data/redux',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          // '@services': './src/services',
        },
      },
    ],
    ['inline-dotenv'],
  ],
};
