import path from 'path'
import { fileURLToPath } from 'url'
import nodeExternals from 'webpack-node-externals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default (env, argv) => {
  const isDevelopment = argv.mode === 'development'

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/server.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      clean: true
    },
    target: 'node',
    externals: [
      nodeExternals({
        allowlist: [/^@/, 'cors', 'express', 'mysql2', 'dotenv']
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: { node: 'current' }
                  }
                ]
              ]
            }
          }
        }
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/')
      },
      extensions: ['.js', '.json']
    }
  }
}
