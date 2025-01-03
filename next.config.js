// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Webpack config
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                assert: require.resolve('assert/'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                os: require.resolve('os-browserify/browser'),
                url: require.resolve('url/'),
                zlib: require.resolve('browserify-zlib'),
                buffer: require.resolve('buffer/'),
                vm: false,
            }
            
            config.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                })
            )
        }
        
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, 'src'),
        }
        
        return config
    },
}

module.exports = nextConfig
