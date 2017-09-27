export default (isServer) => {
  const output = {
    presets: [
      ['env', { targets: { browsers: ['last 2 versions', 'safari >= 7'] } }],
      'react',
      'stage-0',
    ],
    plugins: [],
  };

  if (isServer) {
    output.plugins = [
      [
        'css-modules-transform',
        {
          generateScopedName: '[name]__[local]___[hash:base64:5]',
          extensions: ['.scss'],
        },
      ],
      [
        'transform-runtime',
      ],
    ];
  }

  return output;
};
