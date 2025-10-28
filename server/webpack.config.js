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
    watch: true,
    target: 'node',
    externals: [
      nodeExternals({
        // Thêm vào đây các module CommonJS cần xử lý
        allowlist: ['cors', 'express']
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
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/')
      }
    }
  }
}
