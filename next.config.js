// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const appInfo = {
    name: 'Saber',
    title: 'Saber | Solana AMM',
    description: 'Saber is an automated market maker for trading stable asset pairs on Solana.',
    url: 'https://saberdao.io',
    favicon: '/saber/favicon.ico',
    colors: {
        theme: '#3D42CE',
    },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Webpack config
    webpack: (config, { isServer, dev }) => {
        // Polyfills y fallbacks para el cliente
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
                events: require.resolve('events/'),
                fs: false,
                vm: false,
            }

            // Buffer polyfill
            config.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                })
            )

            // Node polyfills
            config.plugins.push(new NodePolyfillPlugin())
        }

        // Alias configuration
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, 'src'),
        }

        // Bundle analyzer en modo desarrollo
        if (process.env.ANALYZE === 'true' && !isServer) {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'server',
                })
            )
        }

        // Favicon configuration
        if (!dev && !isServer) {
            config.plugins.push(
                new FaviconsWebpackPlugin({
                    logo: path.join(__dirname, 'public', appInfo.favicon),
                    prefix: 'icons/',
                    favicons: {
                        appName: appInfo.name,
                        appDescription: appInfo.description,
                        developerName: `${appInfo.name} Team`,
                        developerURL: appInfo.url,
                        theme_color: appInfo.colors.theme,
                        icons: {
                            coast: false,
                            yandex: false,
                        },
                    },
                })
            )
        }
        return config
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'arweave.net',
            },
            {
                protocol: 'https',
                hostname: 'www.arweave.net',
            },
            {
                protocol: 'https',
                hostname: 'shdw-drive.genesysgo.net',
            },
            {
                protocol: 'https',
                hostname: 'metadata.degods.com',
            },
            {
                protocol: 'https',
                hostname: 'img-cdn.magiceden.dev',
            },
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
            },
            {
                protocol: 'https',
                hostname: 'registry.saber.so',
            },
            {
                protocol: 'https',
                hostname: 'coin98.s3.ap-southeast-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'bafkreig55mf3lazzbgndiqyqvdmchdsykvvebww7cqlws6ywgog5xfdzta.ipfs.nftstorage.link',
            },
            {
                protocol: 'https',
                hostname: 'bafkreiflz2xxkfn33qjch2wj55bvbn33q3s4mmb6bye5pt3mpgy4t2wg4e.ipfs.nftstorage.link',
            },
            {
                protocol: 'https',
                hostname: 'ipfs.io',
            },
            {
                protocol: 'https',
                hostname: 'dev.euroe.com',
            },
            {
                protocol: 'https',
                hostname: 'www.circle.com',
            },
            {
                protocol: 'https',
                hostname: 'static.jup.ag',
            },
            {
                protocol: 'https',
                hostname: 'api.degencdn.com',
            },
            {
                protocol: 'https',
                hostname: 'cogent-cogs.s3.us-west-2.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'solanahub.app',
            },
        ],
    },
}

module.exports = nextConfig
