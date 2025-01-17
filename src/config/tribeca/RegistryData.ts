import { PublicKey } from '@solana/web3.js';
import { GovernorConfigJSON } from '@tribecahq/registry';
import BN from 'bn.js';

// types of networks
export type NetworkType = 'devnet' | 'mainnet-beta' | 'testnet'

// type for registry data
type RegistryDataType = {
    readonly [K in NetworkType]?: readonly GovernorConfigJSON[]
}

// registry data
export const REGISTRY_DATA: RegistryDataType = {
    'mainnet-beta': [
        {
            'address': '8VfcdkmBt9ewPr3XzBP9zYVsAqgKSmB7yD4SH5CoFkdt',
            'addresses': {
                'electorate': {
                    'address': 'D4gX75K5T4fkAfcE38bd58DnWzcwsoUXf8sBVYFtQMro',
                    'label': 'Electorate',
                },
                'governor': {
                    'address': '8VfcdkmBt9ewPr3XzBP9zYVsAqgKSmB7yD4SH5CoFkdt',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': 'CVed3YWncwN4Be5fK7CDQ8FSSsAjeZ1KdXL2sTYdxSyt',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'Acumen bridges crypto and traditional assets through DeFi to democratize access to capital globally',
            'govToken': {
                'address': 'ACUMENkbnxQPAsN8XrNA11sY3NmXDNKVCqS82EiDqMYB',
                'chainId': 101,
                'decimals': 9,
                'extensions': {
                    'coingeckoId': 'acumen',
                    'discord': 'https://discord.com/invite/UXDnngxRmn',
                    'medium': 'https://acumenofficial.medium.com/',
                    'serumV3Usdc': '94CZWJMy7Jmc7gSM288WmFfse596H12KCKgwMARkyvhw',
                    'twitter': 'https://twitter.com/acumenofficial',
                    'website': 'https://acumen.network/',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ACUMENkbnxQPAsN8XrNA11sY3NmXDNKVCqS82EiDqMYB/logo3.svg',
                'name': 'Acumen Governance Token',
                'symbol': 'ACM',
            },
            'governance': {
                'address': '8VfcdkmBt9ewPr3XzBP9zYVsAqgKSmB7yD4SH5CoFkdt',
                'description': 'Acumen bridges crypto and traditional assets through DeFi to democratize access to capital globally',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ACUMENkbnxQPAsN8XrNA11sY3NmXDNKVCqS82EiDqMYB/logo3.svg',
                'name': 'Acumen DAO',
                'network': 'mainnet-beta',
                'slug': 'acm',
                'token': {
                    'address': 'ACUMENkbnxQPAsN8XrNA11sY3NmXDNKVCqS82EiDqMYB',
                    'chainId': 101,
                    'decimals': 9,
                    'extensions': {
                        'coingeckoId': 'acumen',
                        'discord': 'https://discord.com/invite/UXDnngxRmn',
                        'medium': 'https://acumenofficial.medium.com/',
                        'serumV3Usdc': '94CZWJMy7Jmc7gSM288WmFfse596H12KCKgwMARkyvhw',
                        'twitter': 'https://twitter.com/acumenofficial',
                        'website': 'https://acumen.network/',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ACUMENkbnxQPAsN8XrNA11sY3NmXDNKVCqS82EiDqMYB/logo3.svg',
                    'name': 'Acumen Governance Token',
                    'symbol': 'ACM',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ACUMENkbnxQPAsN8XrNA11sY3NmXDNKVCqS82EiDqMYB/logo3.svg',
            'links': {
                'discord': {
                    'label': 'Discord',
                    'url': 'https://discord.gg/fs8VqCFfRy',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/AcumenProtocol/',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://acumenofficial.medium.com/',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/acumenofficial',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://acumen.network',
                },
            },
            'name': 'Acumen DAO',
            'slug': 'acm',
        },
        {
            'address': 'EnWtE8QEWYGkbVknjodYmnZPFt7Fpk9U9cBRpXY5e1Gh',
            'description': 'Cashio\'s Memecoin #gmoo',
            'gauge': {
                'gaugemeister': '3zfW5niUjbGucfp81ksTwD7PHafadWXmUZWebQZWQnio',
            },
            'govToken': {
                'address': 'CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP',
                'chainId': 101,
                'decimals': 6,
                'extensions': {
                    'discord': 'https://discord.com/invite/GmkRRKJkuh',
                    'medium': 'https://medium.com/@cashioapp',
                    'twitter': 'https://twitter.com/CashioApp',
                    'website': 'https://cashio.app',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP/icon.png',
                'name': 'Cash Cow',
                'symbol': 'COW',
                'tags': [
                    'governance-token',
                ],
            },
            'governance': {
                'address': 'EnWtE8QEWYGkbVknjodYmnZPFt7Fpk9U9cBRpXY5e1Gh',
                'description': 'Cashio\'s Memecoin #gmoo',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP/icon.png',
                'name': 'Cash Cow DAO',
                'network': 'mainnet-beta',
                'slug': 'cow',
                'token': {
                    'address': 'CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP',
                    'chainId': 101,
                    'decimals': 6,
                    'extensions': {
                        'discord': 'https://discord.com/invite/GmkRRKJkuh',
                        'medium': 'https://medium.com/@cashioapp',
                        'twitter': 'https://twitter.com/CashioApp',
                        'website': 'https://cashio.app',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP/icon.png',
                    'name': 'Cash Cow',
                    'symbol': 'COW',
                    'tags': [
                        'governance-token',
                    ],
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP/icon.png',
            'minter': {
                'mintWrapper': 'GVtygEvQRRxXCbeNEwVHkCzdt8jswr7T2gYLNtJnhGHo',
            },
            'name': 'Cash Cow DAO',
            'quarry': {
                'additionalRewarders': [],
                'features': [],
                'gauge': {
                    'gaugemeister': new PublicKey('3zfW5niUjbGucfp81ksTwD7PHafadWXmUZWebQZWQnio'),
                },
                'mintWrapper': 'GVtygEvQRRxXCbeNEwVHkCzdt8jswr7T2gYLNtJnhGHo',
            },
            'slug': 'cow',
        },
        {
            'address': 'cysPXAjehMpVKUapzbMCCnpFxUFFryEWEaLgnb9NrR8',
            'addresses': {
                'electorate': {
                    'address': '6vGZ4L4QpDDEU8uet6TGJCJZSLcWg2yjRKFkNFumdZUn',
                    'label': 'Electorate',
                },
                'emergency-dao': {
                    'address': '9JnDhqwFjbWQteZBuWvM4MZqoPaj1WiccHgRHhtF8KVh',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
                'executive-council': {
                    'address': '3X9o4aanui8rQVPtYGz1ix8j4qYuJ3aZbWzUsZJGsMK5',
                    'label': 'Executive Council',
                    'type': 'smart-wallet',
                },
                'governor': {
                    'address': 'HnV7iBwe3pfeUdmBwmNir8jDWUunsb7CuGSHnnBdMJBC',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': '4e8ae3uEcfFMA16UL8ZsKiFChKybwTDQtyTaw5Kv4J73',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'Concentrated liquidity AMM on Solana',
            'govToken': {
                'address': 'EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96',
                'chainId': 101,
                'decimals': 9,
                'extensions': {
                    'coingeckoId': 'fabric',
                    'serumV3Usdc': 'Cud48DK2qoxsWNzQeTL5D8sAiHsGwG8Ev1VMNcYLayxt',
                    'twitter': 'https://twitter.com/official_fabric',
                    'website': 'https://fsynth.io/',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96/logo.png',
                'name': 'FABRIC',
                'symbol': 'FAB',
            },
            'governance': {
                'address': 'cysPXAjehMpVKUapzbMCCnpFxUFFryEWEaLgnb9NrR8',
                'description': 'Concentrated liquidity AMM on Solana',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96/logo.png',
                'name': 'Cykura',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('2000000000000'),  // TokenQuantity
                        'timelockDelay': 1,
                        'votingDelay': 1,
                        'votingPeriod': 259200,
                        'proposalActivationMinVotes': '2000000000000',  // string
                    },
                    'locker': {
                        'maxStakeDuration': 157680000,
                        'maxStakeVoteMultiplier': 10,
                        'minStakeDuration': 86400,
                        'proposalActivationMinVotes': new BN('2000000000000'),  // TokenQuantity
                        'whitelistEnabled': true,
                        'quorumVotes': '2000000000000',  // string
                    },
                },
                'slug': 'cys',
                'token': {
                    'address': 'EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96',
                    'chainId': 101,
                    'decimals': 9,
                    'extensions': {
                        'coingeckoId': 'fabric',
                        'serumV3Usdc': 'Cud48DK2qoxsWNzQeTL5D8sAiHsGwG8Ev1VMNcYLayxt',
                        'twitter': 'https://twitter.com/official_fabric',
                        'website': 'https://fsynth.io/',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96/logo.png',
                    'name': 'FABRIC',
                    'symbol': 'FAB',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96/logo.png',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://app.cykura.io',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'http://discord.gg/gyaK56UreX',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/cykura',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://cykura.medium.com/',
                },
                'telegram': {
                    'label': 'Telegram',
                    'url': 'https://t.me/cykuraofficialchat',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/cykurafi',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://cykura.io',
                },
            },
            'name': 'Cykura',
            'slug': 'cys',
        },
        {
            'address': 'CKRFN8znjVo4WRmsdJ51UqVDPopYySR6mwJ9NwW7CCDJ',
            'addresses': {
                'electorate': {
                    'address': 'DWDmk7SKAEcNL57otur2d4y3vXQjpSqUdLdJef2w91XX',
                    'label': 'Electorate',
                },
                'emergency-dao': {
                    'address': 'A583QaEipLfeECJ9txe1hxagsFhmSNnv1moSzNuLtrnM',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
                'executive-council': {
                    'address': 'FgstL61BakncvWGNFwRE4agwWJqPRXMtY7MqzqtGn1mt',
                    'label': 'Executive Council',
                    'type': 'smart-wallet',
                },
                'governor': {
                    'address': 'CKRFN8znjVo4WRmsdJ51UqVDPopYySR6mwJ9NwW7CCDJ',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': '5u9sfC9dn76oudFMBHAA1x8Cgbnjy7NRZGrQ2M36kT84',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'Tokenised synthetics on Solana',
            'govToken': {
                'address': 'EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96',
                'chainId': 101,
                'decimals': 9,
                'extensions': {
                    'coingeckoId': 'fabric',
                    'serumV3Usdc': 'Cud48DK2qoxsWNzQeTL5D8sAiHsGwG8Ev1VMNcYLayxt',
                    'twitter': 'https://twitter.com/official_fabric',
                    'website': 'https://fsynth.io/',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96/logo.png',
                'name': 'FABRIC',
                'symbol': 'FAB',
            },
            'governance': {
                'address': 'CKRFN8znjVo4WRmsdJ51UqVDPopYySR6mwJ9NwW7CCDJ',
                'description': 'Tokenised synthetics on Solana',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96/logo.png',
                'name': 'Fabric',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('12000000000000000'),  // TokenQuantity   
                        'timelockDelay': 86400,
                        'votingDelay': 86400,
                        'votingPeriod': 259200,
                        'proposalActivationMinVotes': '12000000000000000',  // string
                    },
                    'locker': {
                        'maxStakeDuration': 157680000,
                        'maxStakeVoteMultiplier': 10,
                        'minStakeDuration': 259200,
                        'proposalActivationMinVotes': new BN('1000000000000000'),  // TokenQuantity
                        'whitelistEnabled': true,
                        'quorumVotes': '12000000000000000',  // string
                    },
                },
                'slug': 'fab',
                'token': {
                    'address': 'EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96',
                    'chainId': 101,
                    'decimals': 9,
                    'extensions': {
                        'coingeckoId': 'fabric',
                        'serumV3Usdc': 'Cud48DK2qoxsWNzQeTL5D8sAiHsGwG8Ev1VMNcYLayxt',
                        'twitter': 'https://twitter.com/official_fabric',
                        'website': 'https://fsynth.io/',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96/logo.png',
                    'name': 'FABRIC',
                    'symbol': 'FAB',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96/logo.png',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://app.fsynth.io',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://fsynth.io/chat',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/fabric-foundation',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://fsynth.io/blog',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/official_fabric',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://fsynth.io',
                },
            },
            'name': 'Fabric',
            'slug': 'fab',
        },
        {
            'address': 'FQFoGJR3maMmgsZMoerEXKsHNWSc3uhMgqRheDXQu7EF',
            'addresses': {
                'electorate': {
                    'address': 'GBcrkpG6Za6nMFBMRtJqMJSrdGTaHSMRsprBQjrUSUZ7',
                    'label': 'Electorate',
                },
                'emergency-dao': {
                    'address': '7vZ3nVQZKAaWCJEgHYHEhqpQEJKGYYrVZ1Qc6yC2eEnB',
                    'description': 'Multisig which can override the vote governance process in case of emergency.',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
                'executive-council': {
                    'address': '3Lpz6sCRaqAsuhX2e2Lg2WeDzyJoZWzdhwtnw9UQRr6r',
                    'description': 'A group of trusted individuals specified in a Smart Wallet which sign via an Owner Invoker.',
                    'label': 'Executive Council',
                    'type': 'smart-wallet',
                },
                'governor': {
                    'address': 'FQFoGJR3maMmgsZMoerEXKsHNWSc3uhMgqRheDXQu7EF',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': '76LNjYf477Fv6wzwcw3sV94G967je4Ps7bWHe1G3RzEx',
                    'description': 'Multisig Solana wallet with Timelock capabilities which is used for execution.',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'Test DAO for GGA',
            'govToken': {
                'address': 'CEZCH6PZjUw8RXfhsS8vSo4wGeoMMhAyzaFWHpXp3tRn',
                'chainId': 101,
                'decimals': 8,
                // 'description': 'General parameters for the governance token used for the DAO',
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CEZCH6PZjUw8RXfhsS8vSo4wGeoMMhAyzaFWHpXp3tRn/logo.png',
                'name': 'GGA DAO Test Token',
                'symbol': 'GGADTT',
                'tags': [
                    'utility-token',
                ],
            },
            'governance': {
                'address': 'FQFoGJR3maMmgsZMoerEXKsHNWSc3uhMgqRheDXQu7EF',
                'description': 'Test DAO for GGA',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CEZCH6PZjUw8RXfhsS8vSo4wGeoMMhAyzaFWHpXp3tRn/logo.png',
                'name': 'GGA Test DAO',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('400000000000000'),  // TokenQuantity
                        'timelockDelay': 86400,
                        'votingDelay': 86400,
                        'votingPeriod': 259200,
                        'proposalActivationMinVotes': '10000000000000',  // TokenQuantity
                    },
                    'locker': {
                        'maxStakeDuration': 157680000,
                        'maxStakeVoteMultiplier': 10,
                        'minStakeDuration': 86400,
                        'proposalActivationMinVotes': new BN('10000000000000'),  // TokenQuantity
                        'whitelistEnabled': false,
                        'quorumVotes': '400000000000000',  // TokenQuantity
                    },
                },
                'slug': 'ggatd',
                'token': {
                    'address': 'CEZCH6PZjUw8RXfhsS8vSo4wGeoMMhAyzaFWHpXp3tRn',
                    'chainId': 101,
                    'decimals': 8,
                    // 'description': 'General parameters for the governance token used for the DAO',
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CEZCH6PZjUw8RXfhsS8vSo4wGeoMMhAyzaFWHpXp3tRn/logo.png',
                    'name': 'GGA DAO Test Token',
                    'symbol': 'GGADTT',
                    'tags': [
                        'utility-token',
                    ],
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CEZCH6PZjUw8RXfhsS8vSo4wGeoMMhAyzaFWHpXp3tRn/logo.png',
            'links': {
                'discord': {
                    'label': 'Discord',
                    'url': 'https://discord.gg/gargantua',
                },
                'instagram': {
                    'label': 'Instagram',
                    'url': 'https://www.instagram.com/gargantua_industries',
                },
                'telegram': {
                    'label': 'Telegram',
                    'url': 'https://t.me/Gargantua_Industries',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/Gargantua_Inds',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://www.gargantuaindustries.com',
                },
                'youtube': {
                    'label': 'Youtube',
                    'url': 'https://www.youtube.com/channel/UCOmeiHRH84Arqb9z4u5wshg',
                },
            },
            'name': 'GGA Test DAO',
            'proposals': {
                'discussion': {
                    'link': 'https://discord.com/channels/886489194967474206/979831643470704680/',
                    'prefix': 'https://discord.com/channels/886489194967474206/979831643470704680/',
                    'required': true,
                },
                'notice': 'To create a proposal, first make a post on the [GGA Discord](https://discord.gg/gargantua).\nOnce you have determined that there is sufficient community support,\nadd the link to the discussion thread and create a proposal.\n',
            },
            'slug': 'ggatd',
        },
        {
            'address': 'H7SKkK7Gkk1XpcEdLH3p1ADsi8TMVPR3uFeAgefpFDdH',
            'addresses': {
                'electorate': {
                    'address': '8Kua5bEUcFQmTQTpj2xLh1Zgen48sLCpoxV1LjZtRAet',
                    'label': 'Electorate',
                },
                'emergency-dao': {
                    'address': '7YPYKMRF7Lx13L3XqgDbDoMRbU2Z3NLoGyJrDaVQ5P3T',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
                'executive-council': {
                    'address': 'D1FxNyGYVhUFKkdA13CYzzFWoo4tyMkVRmv7CWaAnrJs',
                    'label': 'Executive Council',
                    'type': 'smart-wallet',
                },
                'governor': {
                    'address': 'H7SKkK7Gkk1XpcEdLH3p1ADsi8TMVPR3uFeAgefpFDdH',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': '7YPYKMRF7Lx13L3XqgDbDoMRbU2Z3NLoGyJrDaVQ5P3T',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'Liquidity staking to secure and decentralize Solana',
            'govToken': {
                'address': 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
                'chainId': 101,
                'decimals': 9,
                'extensions': {
                    'coingeckoId': 'marinade',
                    'discord': 'https://discord.gg/mGqZA5pjRN',
                    'github': 'https://github.com/marinade-finance',
                    'medium': 'https://medium.com/marinade-finance',
                    'twitter': 'https://twitter.com/MarinadeFinance',
                    'website': 'https://marinade.finance',
                },
                'logoURI': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                'name': 'Marinade Protocol Token',
                'symbol': 'MNDE',
            },
            'governance': {
                'address': 'H7SKkK7Gkk1XpcEdLH3p1ADsi8TMVPR3uFeAgefpFDdH',
                'description': 'Liquidity staking to secure and decentralize Solana',
                'iconURL': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                'name': 'Marinade',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('7000000000000000'),  // TokenQuantity
                        'timelockDelay': 432000,
                        'votingDelay': 86400,
                        'votingPeriod': 432000,
                        'proposalActivationMinVotes': '10000000000000',  // TokenQuantity
                    },
                },
                'slug': 'mnde',
                'token': {
                    'address': 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
                    'chainId': 101,
                    'decimals': 9,
                    'extensions': {
                        'coingeckoId': 'marinade',
                        'discord': 'https://discord.gg/mGqZA5pjRN',
                        'github': 'https://github.com/marinade-finance',
                        'medium': 'https://medium.com/marinade-finance',
                        'twitter': 'https://twitter.com/MarinadeFinance',
                        'website': 'https://marinade.finance',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                    'name': 'Marinade Protocol Token',
                    'symbol': 'MNDE',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://marinade.finance/app/staking',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://discord.com/invite/6EtUf4Euu6',
                },
                'forum': {
                    'label': 'Forum',
                    'url': 'https://forum.marinade.finance',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/marinade-finance',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://medium.com/marinade-finance',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/marinadeFinance',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://marinade.finance',
                },
            },
            'mndeNftLocker': {
                'address': 'rLmyBAjCYR1MNc3KSG77y5XXT2DuMxkcxfqLYvjjJCs',
                'app': 'https://marinade.finance/app/mnde',
                'creators': [
                    '6jG2QcwaJPFS8Y9SzgH2kfKPj6ERhLi9RVtH8kRahj4j',
                ],
                'docs': 'https://docs.marinade.finance/governance',
            },
            'name': 'Marinade',
            'nftLockerGauges': [
                {
                    'address': 'LGMrE65TVxJiNX7Dj5e65YZFfz6wBSzFfJXbSobNj9n',
                    'docs': 'https://docs.marinade.finance/governance/gauges',
                    'label': 'Liquidity',
                },
                {
                    'address': 'mvgmBamY7hDWxLNGLshMoZn8nt2P8tKnKhaBeXMVajZ',
                    'docs': 'https://docs.marinade.finance/governance/gauges',
                    'label': 'Validator',
                    'stateAccount': '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC',
                },
            ],
            'proposals': {
                'discussion': {
                    'link': 'https://forum.marinade.finance/',
                    'prefix': 'https://forum.marinade.finance/t/',
                    'required': true,
                },
                'notice': 'To create a proposal, first make a post on the [Marinade Governance Forum](https://forum.marinade.finance/).\n\n\nOnce you have determined that there is sufficient community support, add the link to the discussion thread and create a proposal.\n',
            },
            'slug': 'mnde',
        },
        {
            'address': '3QdRG4feNfDqZ3GpSVGwW6hnSHb7AZ5BAcoKCpV9t2xr',
            'description': 'Leveraged Yield Aggregator on Solana',
            'gauge': {
                'gaugemeister': 'GbaiXZj8qmBA6aRScfDTx23K9VX2AgQqfJ74qdTtDHUr',
            },
            'govToken': {
                'address': 'PoLEXM5xikzieXENFvP7WwHJPorcFiCUVuMo9BAGZT3',
                'chainId': 101,
                'decimals': 6,
                'extensions': {
                    'discord': 'https://discord.gg/RASngHfHhS',
                    'github': 'https://github.com/pole-finance',
                    'medium': 'https://medium.com/pole-aggregator',
                    'serumV3Usdc': 'Ak1UDskYAjztX5YkxW8dmERjLwS9fYmk1b3G6fpWDxp6',
                    'twitter': 'https://twitter.com/Pole_Finance',
                    'website': 'https://pole.finance',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/PoLEXM5xikzieXENFvP7WwHJPorcFiCUVuMo9BAGZT3/logo.svg',
                'name': 'Pole Aggregator Governance Token',
                'symbol': 'POLE',
            },
            'governance': {
                'address': '3QdRG4feNfDqZ3GpSVGwW6hnSHb7AZ5BAcoKCpV9t2xr',
                'description': 'Leveraged Yield Aggregator on Solana',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/PoLEXM5xikzieXENFvP7WwHJPorcFiCUVuMo9BAGZT3/logo.svg',
                'name': 'Pole',
                'network': 'mainnet-beta',
                'slug': 'pole',
                'token': {
                    'address': 'PoLEXM5xikzieXENFvP7WwHJPorcFiCUVuMo9BAGZT3',
                    'chainId': 101,
                    'decimals': 6,
                    'extensions': {
                        'discord': 'https://discord.gg/RASngHfHhS',
                        'github': 'https://github.com/pole-finance',
                        'medium': 'https://medium.com/pole-aggregator',
                        'serumV3Usdc': 'Ak1UDskYAjztX5YkxW8dmERjLwS9fYmk1b3G6fpWDxp6',
                        'twitter': 'https://twitter.com/Pole_Finance',
                        'website': 'https://pole.finance',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/PoLEXM5xikzieXENFvP7WwHJPorcFiCUVuMo9BAGZT3/logo.svg',
                    'name': 'Pole Aggregator Governance Token',
                    'symbol': 'POLE',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/PoLEXM5xikzieXENFvP7WwHJPorcFiCUVuMo9BAGZT3/logo.svg',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://app.pole.finance',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://pole.finance',
                },
            },
            'minter': {},
            'name': 'Pole',
            'quarry': {
                'additionalRewarders': [],
                'features': [],
                'gauge': {
                    'gaugemeister': new PublicKey('GbaiXZj8qmBA6aRScfDTx23K9VX2AgQqfJ74qdTtDHUr'),
                },
                'rewarder': '3ahWtCwoyv4HHYdDtSzSPzD8DDo6jJKqEmPJrdztFnw4',
            },
            'slug': 'pole',
        },
        {
            'address': 'GmUCWNhPKo8tHNsvjPQkh9WyvUmACcdrwV8LApGeLRKb',
            'description': 'A suite of fixed-income products on Solana',
            'gauge': {
                'gaugemeister': '72sErSoiCxLqEmM7Vg2VfJBAd5PVcEaAKti99fd1dRbo',
            },
            'govToken': {
                'address': 'PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y',
                'chainId': 101,
                'decimals': 6,
                'extensions': {
                    'coingeckoId': 'port-finance',
                    'discord': 'https://discord.gg/nAMXAYhTb2',
                    'github': 'https://github.com/port-finance/',
                    'medium': 'https://medium.com/port-finance',
                    'serumV3Usdc': '8x8jf7ikJwgP9UthadtiGFgfFuyyyYPHL3obJAuxFWko',
                    // 'telegram': 'https://t.me/port_finance',
                    'twitter': 'https://twitter.com/port_finance',
                    // 'waterfallbot': 'https://bit.ly/PORTwaterfall',
                    'website': 'https://port.finance/',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y/PORT.png',
                'name': 'Port Finance Token',
                'symbol': 'PORT',
            },
            'governance': {
                'address': 'GmUCWNhPKo8tHNsvjPQkh9WyvUmACcdrwV8LApGeLRKb',
                'description': 'A suite of fixed-income products on Solana',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y/PORT.png',
                'name': 'Port',
                'network': 'mainnet-beta',
                'slug': 'port',
                'token': {
                    'address': 'PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y',
                    'chainId': 101,
                    'decimals': 6,
                    'extensions': {
                        'coingeckoId': 'port-finance',
                        'discord': 'https://discord.gg/nAMXAYhTb2',
                        'github': 'https://github.com/port-finance/',
                        'medium': 'https://medium.com/port-finance',
                        'serumV3Usdc': '8x8jf7ikJwgP9UthadtiGFgfFuyyyYPHL3obJAuxFWko',
                        // 'telegram': 'https://t.me/port_finance',
                        'twitter': 'https://twitter.com/port_finance',
                        // 'waterfallbot': 'https://bit.ly/PORTwaterfall',
                        'website': 'https://port.finance/',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y/PORT.png',
                    'name': 'Port Finance Token',
                    'symbol': 'PORT',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y/PORT.png',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://mainnet.port.finance',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://discord.gg/nAMXAYhTb2',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/port-finance/',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://medium.com/port-finance',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/port_finance',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://port.finance',
                },
            },
            'minter': {
                'mintWrapper': 'HV5q5fTPSQUugUg1xhNQkeviG1g9TL7SSANBizL6xx3W',
            },
            'name': 'Port',
            'quarry': {
                'additionalRewarders': [],
                'features': [],
                'gauge': {
                    'gaugemeister': new PublicKey('72sErSoiCxLqEmM7Vg2VfJBAd5PVcEaAKti99fd1dRbo'),
                },
                'mintWrapper': 'HV5q5fTPSQUugUg1xhNQkeviG1g9TL7SSANBizL6xx3W',
                'rewarder': 'GuHrjvzqDvLTB27ebd9iFKwceCxKvSswzTByDQUTsvdm',
            },
            'slug': 'port',
        },
        {
            'address': '9tnpMysuibKx6SatcH3CWR9ZsSRMBNeBf1mhfL6gAXR4',
            'addresses': {
                'electorate': {
                    'address': '4tr9CDSgZRLYPGdcsm9PztaGSfJtX5CEmqDbEbvCTX2G',
                    'label': 'Electorate',
                },
                'emergency-dao': {
                    'address': 'F9TxY3Bj1tWebTHZPJC323WK8KwAe3W6XKkg2hzCdsKM',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
                'executive-council': {
                    'address': 'ByB3GkPHuUBmzcNbY1Ed7xK2uMkEkNsxTwjMGAFeLsbw',
                    'label': 'Executive Council',
                    'type': 'smart-wallet',
                },
                'governor': {
                    'address': '9tnpMysuibKx6SatcH3CWR9ZsSRMBNeBf1mhfL6gAXR4',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': 'F9TxY3Bj1tWebTHZPJC323WK8KwAe3W6XKkg2hzCdsKM',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'AMM for mean-reverting trading pairs on Solana',
            'gauge': {
                'gaugemeister': '28ZDtf6d2wsYhBvabTxUHTRT6MDxqjmqR7RMCp348tyU',
            },
            'govToken': {
                'address': 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',
                'chainId': 101,
                'decimals': 6,
                'extensions': {
                    'coingeckoId': 'saber',
                    'discord': 'https://chat.saber.so',
                    'github': 'https://github.com/saber-hq',
                    'medium': 'https://blog.saber.so',
                    'serumV3Usdc': 'HXBi8YBwbh4TXF6PjVw81m8Z3Cc4WBofvauj5SBFdgUs',
                    'twitter': 'https://twitter.com/saber_hq',
                    // 'waterfallbot': 'https://bit.ly/SBRwaterfall',
                    'website': 'https://saber.so',
                },
                'logoURI': 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1.svg',
                'name': 'Saber Protocol Token',
                'symbol': 'SBR',
                'tags': [
                    'saber-hidden',
                ],
            },
            'governance': {
                'address': '9tnpMysuibKx6SatcH3CWR9ZsSRMBNeBf1mhfL6gAXR4',
                'description': 'AMM for mean-reverting trading pairs on Solana',
                'iconURL': 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1.svg',
                'name': 'Saber',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('400000000000000'),
                        'timelockDelay': 86400,
                        'votingDelay': 86400,
                        'votingPeriod': 259200,
                        'proposalActivationMinVotes': '10000000000000',
                    },
                    'locker': {
                        'maxStakeDuration': 157680000,
                        'maxStakeVoteMultiplier': 10,
                        'minStakeDuration': 604800,
                        'proposalActivationMinVotes': new BN('10000000000000'),
                        'whitelistEnabled': true,
                        'quorumVotes': '400000000000000',
                    },
                },
                'slug': 'sbr',
                'token': {
                    'address': 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',
                    'chainId': 101,
                    'decimals': 6,
                    'extensions': {
                        'coingeckoId': 'saber',
                        'discord': 'https://chat.saber.so',
                        'github': 'https://github.com/saber-hq',
                        'medium': 'https://blog.saber.so',
                        'serumV3Usdc': 'HXBi8YBwbh4TXF6PjVw81m8Z3Cc4WBofvauj5SBFdgUs',
                        'twitter': 'https://twitter.com/saber_hq',
                        // 'waterfallbot': 'https://bit.ly/SBRwaterfall',
                        'website': 'https://saber.so',
                    },
                    'logoURI': 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1.svg',
                    'name': 'Saber Protocol Token',
                    'symbol': 'SBR',
                    'tags': [
                        'saber-hidden',
                    ],
                },
            },
            'iconURL': 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1.svg',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://app.saber.so',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://chat.saber.so',
                },
                'forum': {
                    'label': 'Forum',
                    'url': 'https://github.com/saber-hq/governance/discussions/',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/saber-hq',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://blog.saber.so',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/saber_hq',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://saber.so',
                },
            },
            'minter': {
                'mintWrapper': 'EVVDA3ZiAjTizemLGXNUN3gb6cffQFEYkFjFZokPmUPz',
                'redeemer': 'CL9wkGFT3SZRRNa9dgaovuRV7jrVVigBUZ6DjcgySsCU',
            },
            'name': 'Saber',
            'proposals': {
                'discussion': {
                    'link': 'https://github.com/saber-hq/governance/issues/new?assignees=&labels=proposal&template=governance-proposal.md&title=%5BPROPOSAL%5D',
                    'prefix': 'https://github.com/saber-hq/governance/issues/',
                    'required': true,
                },
                'notice': 'To create a proposal, first make a proposal on the [Saber Governance Forum](https://github.com/saber-hq/governance/issues/new?assignees=&labels=proposal&template=governance-proposal.md&title=%5BPROPOSAL%5D).\n\nOnce you have determined that there is sufficient community support,\nadd the link to the discussion thread and create a proposal.\n',
            },
            'quarry': {
                'additionalRewarders': [
                    '2UsGfm8S36eW58U4JeKgVC9fcXsqf7D6vfm4GHUtnENn',
                    'CXer5v3osVQFDWUB3SJUPB1PN1dB3dQSQfymyAnmCryp',
                    'Wz2Zzi5BHmYr75yNzJG8NZ8U1T9cSWKf6ATRwZF7qV6',
                    '9eNj2Y4YdqM9Unw8qTm8kzx1Xt64Rft8a6HjvpkPL7QJ',
                ],
                'features': [
                    'issue-tokens',
                ],
                'gauge': {
                    'gaugemeister': new PublicKey('28ZDtf6d2wsYhBvabTxUHTRT6MDxqjmqR7RMCp348tyU'),
                },
                'mintWrapper': 'EVVDA3ZiAjTizemLGXNUN3gb6cffQFEYkFjFZokPmUPz',
                'operator': {
                    'address': new PublicKey('GdW7Accmjusk8qKUPoCMJasEje63h97igqkjdEpacpRN'),
                    'features': [
                        'set-annual-rewards-rate',
                    ],
                },
                'redeemer': 'CL9wkGFT3SZRRNa9dgaovuRV7jrVVigBUZ6DjcgySsCU',
                'rewarder': 'rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk',
            },
            'slug': 'sbr',
        },
        {
            'address': 'HdczogoASRJeChYRLUNbMKPRdcDrHYgFg3z3FLz5B6ts',
            'addresses': {
                'electorate': {
                    'address': 'F8y3UhdysUF1MS2posoZVKkRUwf9UYDKttAZpdwz96Tg',
                    'label': 'Electorate',
                },
                'emergency-dao': {
                    'address': '74DYnFGWo7cCvmbho6szAaqW8PozYBX8uj5wgqFNMNJp',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
                'executive-council': {
                    'address': '8E4FrgroyxFHZSpjKyV1JUqWEHrutZ4g28QhvE3qRyJd',
                    'label': 'Executive Council',
                    'type': 'smart-wallet',
                },
                'governor': {
                    'address': 'HdczogoASRJeChYRLUNbMKPRdcDrHYgFg3z3FLz5B6ts',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': 'FWropvQveWS9gRDCV4JaidqzMMmEu4sQMK4JqjVMCV3j',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'Metaverse services and investment DAO',
            'govToken': {
                'address': 'C5EefTmWXHJWFkN3Dh7QyFUnBG3UXSu8h6qVs6xtaLxy',
                'chainId': 101,
                'decimals': 6,
                'extensions': {
                    'discord': 'https://discord.gg/ZVQNNtbw3u',
                    'twitter': 'https://twitter.com/soliensnft',
                    'website': 'https://soliens.super.site/',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/C5EefTmWXHJWFkN3Dh7QyFUnBG3UXSu8h6qVs6xtaLxy/daologo.png',
                'name': 'Solien DAO',
                'symbol': 'SDUST',
                'tags': [
                    'nft',
                ],
            },
            'governance': {
                'address': 'HdczogoASRJeChYRLUNbMKPRdcDrHYgFg3z3FLz5B6ts',
                'description': 'Metaverse services and investment DAO',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/C5EefTmWXHJWFkN3Dh7QyFUnBG3UXSu8h6qVs6xtaLxy/daologo.png',
                'name': 'Solien',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('150000000000'),
                        'timelockDelay': 30,
                        'votingDelay': 86400,
                        'votingPeriod': 259200,
                        'proposalActivationMinVotes': '50000000000',
                    },
                    'locker': {
                        'maxStakeDuration': 157680000,
                        'maxStakeVoteMultiplier': 10,
                        'minStakeDuration': 604800,
                        'proposalActivationMinVotes': new BN('50000000000'),
                        'whitelistEnabled': true,
                        'quorumVotes': '150000000000',
                    },
                },
                'slug': 'sdust',
                'token': {
                    'address': 'C5EefTmWXHJWFkN3Dh7QyFUnBG3UXSu8h6qVs6xtaLxy',
                    'chainId': 101,
                    'decimals': 6,
                    'extensions': {
                        'discord': 'https://discord.gg/ZVQNNtbw3u',
                        'twitter': 'https://twitter.com/soliensnft',
                        'website': 'https://soliens.super.site/',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/C5EefTmWXHJWFkN3Dh7QyFUnBG3UXSu8h6qVs6xtaLxy/daologo.png',
                    'name': 'Solien DAO',
                    'symbol': 'SDUST',
                    'tags': [
                        'nft',
                    ],
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/C5EefTmWXHJWFkN3Dh7QyFUnBG3UXSu8h6qVs6xtaLxy/daologo.png',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://app.solien.io/',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://discord.gg/FrtBMHFE',
                },
                'forum': {
                    'label': 'Forum',
                    'url': 'https://forum.solien.io/',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/soliensnft',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://solien.io/',
                },
            },
            'name': 'Solien',
            'proposals': {
                'discussion': {
                    'link': 'https://forum.solien.io/c/governance/5',
                    'prefix': 'https://forum.solien.io/t/',
                    'required': true,
                },
                'notice': 'To create a proposal, first make a post on the [Solien Governance Forum](https://forum.solien.io/c/governance/6).\n\nOnce you have determined that there is sufficient community support,\nadd the link to the discussion thread and create a proposal.\n',
            },
            'slug': 'sdust',
        },
        {
            'address': 'CbGthriWTbZFYT6Mro1de7hwHLGWC5f8huMjgBuCRUsh',
            'description': 'The gateway to Anchor interest bearing assets on Solana',
            'gauge': {
                'gaugemeister': 'Gc7hPSbWNT8zBwpSCWKcb5gv7WHHqFkTJVsbPWxD2qyA',
            },
            'govToken': {
                'address': 'SLNAAQ8VT6DRDc3W9UPDjFyRt7u4mzh8Z4WYMDjJc35',
                'chainId': 101,
                'decimals': 6,
                'extensions': {
                    'website': 'https://soluna.money/',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SLNAAQ8VT6DRDc3W9UPDjFyRt7u4mzh8Z4WYMDjJc35/slna.svg',
                'name': 'Soluna Governance Token',
                'symbol': 'SLNA',
            },
            'governance': {
                'address': 'CbGthriWTbZFYT6Mro1de7hwHLGWC5f8huMjgBuCRUsh',
                'description': 'The gateway to Anchor interest bearing assets on Solana',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SLNAAQ8VT6DRDc3W9UPDjFyRt7u4mzh8Z4WYMDjJc35/slna.svg',
                'name': 'Soluna',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('40000000000000'),
                        'timelockDelay': 86400,
                        'votingDelay': 86400,
                        'votingPeriod': 259200,
                        'proposalActivationMinVotes': '1000000000000',
                    },
                    'locker': {
                        'maxStakeDuration': 157680000,
                        'maxStakeVoteMultiplier': 10,
                        'minStakeDuration': 86400,
                        'proposalActivationMinVotes': new BN('1000000000000'),
                        'whitelistEnabled': true,
                        'quorumVotes': '40000000000000',
                    },
                },
                'slug': 'slna',
                'token': {
                    'address': 'SLNAAQ8VT6DRDc3W9UPDjFyRt7u4mzh8Z4WYMDjJc35',
                    'chainId': 101,
                    'decimals': 6,
                    'extensions': {
                        'website': 'https://soluna.money/',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SLNAAQ8VT6DRDc3W9UPDjFyRt7u4mzh8Z4WYMDjJc35/slna.svg',
                    'name': 'Soluna Governance Token',
                    'symbol': 'SLNA',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SLNAAQ8VT6DRDc3W9UPDjFyRt7u4mzh8Z4WYMDjJc35/slna.svg',
            'links': {
                'discord': {
                    'label': 'Discord',
                    'url': 'discord.gg/55xvnWrnPr',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/soluna-protocol',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://medium.com/solunadao',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/solunaDAO',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://soluna.money',
                },
            },
            'minter': {
                'mintWrapper': 'DvZudaVyiZhpL8W6BnsaFaJp6jWV8nDMhQGfkXKXBpXA',
            },
            'name': 'Soluna',
            'quarry': {
                'additionalRewarders': [],
                'features': [],
                'gauge': {
                    'gaugemeister': new PublicKey('Gc7hPSbWNT8zBwpSCWKcb5gv7WHHqFkTJVsbPWxD2qyA'),
                },
                'mintWrapper': 'DvZudaVyiZhpL8W6BnsaFaJp6jWV8nDMhQGfkXKXBpXA',
                'operator': {
                    'address': new PublicKey('H4VXFyfeUDahSokaE9mjGUaP6UDREqyXcjiHWmfq9yQs'),
                    'features': [],
                },
                'rewarder': 'AnYPEy4H3U3XhT5hwM4cGPxLk3CNqn9kkqzyaXhj1LKc',
            },
            'slug': 'slna',
        },
        {
            'address': '8NDDbatDi5WxB433q3qyMMMYvjodMkCenGdTjkxuASyE',
            'addresses': {
                'emergency-dao': {
                    'address': 'FE61NQa1pz2axEaxdySK4ZZQdo8sastWx3xN8ZCxXfGM',
                    'description': 'Multisig which can override the vote governance process in case of emergency.',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
            },
            'description': 'Solana\'s cross-chain DeFi yield aggregator.',
            'gauge': {
                'gaugemeister': 'GBYZGgJks1re9BkJ8RB5QUMmmoyb7MsQ9ABFrgX5c5GZ',
            },
            'govToken': {
                'address': 'SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag',
                'chainId': 101,
                'decimals': 6,
                'extensions': {
                    'coingeckoId': 'sunny-aggregator',
                    'discord': 'https://chat.sunny.ag',
                    'github': 'https://github.com/SunnyAggregator',
                    'medium': 'https://medium.com/sunny-aggregator',
                    'serumV3Usdc': 'Aubv1QBFh4bwB2wbP1DaPW21YyQBLfgjg8L4PHTaPzRc',
                    'twitter': 'https://twitter.com/SunnyAggregator',
                    // 'waterfallbot': 'https://bit.ly/SUNNYwaterfall',
                    'website': 'https://sunny.ag/',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag/logo.svg',
                'name': 'Sunny Governance Token',
                'symbol': 'SUNNY',
            },
            'governance': {
                'address': '8NDDbatDi5WxB433q3qyMMMYvjodMkCenGdTjkxuASyE',
                'description': 'Solana\'s cross-chain DeFi yield aggregator.',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag/logo.svg',
                'name': 'Sunny Aggregator',
                'network': 'mainnet-beta',
                'slug': 'sunny',
                'token': {
                    'address': 'SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag',
                    'chainId': 101,
                    'decimals': 6,
                    'extensions': {
                        'coingeckoId': 'sunny-aggregator',
                        'discord': 'https://chat.sunny.ag',
                        'github': 'https://github.com/SunnyAggregator',
                        'medium': 'https://medium.com/sunny-aggregator',
                        'serumV3Usdc': 'Aubv1QBFh4bwB2wbP1DaPW21YyQBLfgjg8L4PHTaPzRc',
                        'twitter': 'https://twitter.com/SunnyAggregator',
                        // 'waterfallbot': 'https://bit.ly/SUNNYwaterfall',
                        'website': 'https://sunny.ag/',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag/logo.svg',
                    'name': 'Sunny Governance Token',
                    'symbol': 'SUNNY',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag/logo.svg',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://app.sunny.ag',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://chat.sunny.ag/',
                },
                'forum': {
                    'label': 'Forum',
                    'url': 'https://github.com/SunnyAggregator/governance/discussions/',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/SunnyAggregator',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://medium.com/sunny-aggregator',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/SunnyAggregator',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://sunny.ag',
                },
            },
            'minter': {},
            'name': 'Sunny Aggregator',
            'proposals': {
                'discussion': {
                    'link': 'https://github.com/SunnyAggregator/governance/labels/proposal',
                    'prefix': 'https://github.com/SunnyAggregator/governance/issues/',
                    'required': true,
                },
                'notice': 'To create a proposal, first create a proposal on the [Sunny Aggregator Governance GitHub repository](https://github.com/SunnyAggregator/governance/issues/new?assignees=&labels=proposal&template=governance-proposal.md&title=%5BPROPOSAL%5D).\n\nOnce you have determined that there is sufficient community support,\nadd the link to the GitHub issue and create a proposal.\n',
            },
            'quarry': {
                'additionalRewarders': [],
                'features': [],
                'gauge': {
                    'gaugemeister': new PublicKey('GBYZGgJks1re9BkJ8RB5QUMmmoyb7MsQ9ABFrgX5c5GZ'),
                },
                'rewarder': '97PmYbGpSHSrKrUkQX793mjpA2EA9rrQKkHsQuvenU44',
            },
            'slug': 'sunny',
        },
    ],
    'devnet': [
        {
            'address': 'H7SKkK7Gkk1XpcEdLH3p1ADsi8TMVPR3uFeAgefpFDdH',
            'addresses': {
                'electorate': {
                    'address': '8Kua5bEUcFQmTQTpj2xLh1Zgen48sLCpoxV1LjZtRAet',
                    'label': 'Electorate',
                },
                'emergency-dao': {
                    'address': '7YPYKMRF7Lx13L3XqgDbDoMRbU2Z3NLoGyJrDaVQ5P3T',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
                'executive-council': {
                    'address': 'D1FxNyGYVhUFKkdA13CYzzFWoo4tyMkVRmv7CWaAnrJs',
                    'label': 'Executive Council',
                    'type': 'smart-wallet',
                },
                'governor': {
                    'address': 'H7SKkK7Gkk1XpcEdLH3p1ADsi8TMVPR3uFeAgefpFDdH',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': '7YPYKMRF7Lx13L3XqgDbDoMRbU2Z3NLoGyJrDaVQ5P3T',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'Liquidity staking to secure and decentralize Solana',
            'govToken': {
                'address': 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
                'chainId': 101,
                'decimals': 9,
                'extensions': {
                    'coingeckoId': 'marinade',
                    'discord': 'https://discord.gg/mGqZA5pjRN',
                    'github': 'https://github.com/marinade-finance',
                    'medium': 'https://medium.com/marinade-finance',
                    'twitter': 'https://twitter.com/MarinadeFinance',
                    'website': 'https://marinade.finance',
                },
                'logoURI': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                'name': 'Marinade Protocol Token',
                'symbol': 'MNDE',
            },
            'governance': {
                'address': 'H7SKkK7Gkk1XpcEdLH3p1ADsi8TMVPR3uFeAgefpFDdH',
                'description': 'Liquidity staking to secure and decentralize Solana',
                'iconURL': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                'name': 'Marinade',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('7000000000000000'),  // TokenQuantity
                        'timelockDelay': 432000,
                        'votingDelay': 86400,
                        'votingPeriod': 432000,
                        'proposalActivationMinVotes': '10000000000000',  // TokenQuantity
                    },
                },
                'slug': 'mnde',
                'token': {
                    'address': 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
                    'chainId': 101,
                    'decimals': 9,
                    'extensions': {
                        'coingeckoId': 'marinade',
                        'discord': 'https://discord.gg/mGqZA5pjRN',
                        'github': 'https://github.com/marinade-finance',
                        'medium': 'https://medium.com/marinade-finance',
                        'twitter': 'https://twitter.com/MarinadeFinance',
                        'website': 'https://marinade.finance',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                    'name': 'Marinade Protocol Token',
                    'symbol': 'MNDE',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://marinade.finance/app/staking',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://discord.com/invite/6EtUf4Euu6',
                },
                'forum': {
                    'label': 'Forum',
                    'url': 'https://forum.marinade.finance',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/marinade-finance',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://medium.com/marinade-finance',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/marinadeFinance',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://marinade.finance',
                },
            },
            'mndeNftLocker': {
                'address': 'rLmyBAjCYR1MNc3KSG77y5XXT2DuMxkcxfqLYvjjJCs',
                'app': 'https://marinade.finance/app/mnde',
                'creators': [
                    '6jG2QcwaJPFS8Y9SzgH2kfKPj6ERhLi9RVtH8kRahj4j',
                ],
                'docs': 'https://docs.marinade.finance/governance',
            },
            'name': 'Marinade',
            'nftLockerGauges': [
                {
                    'address': 'LGMrE65TVxJiNX7Dj5e65YZFfz6wBSzFfJXbSobNj9n',
                    'docs': 'https://docs.marinade.finance/governance/gauges',
                    'label': 'Liquidity',
                },
                {
                    'address': 'mvgmBamY7hDWxLNGLshMoZn8nt2P8tKnKhaBeXMVajZ',
                    'docs': 'https://docs.marinade.finance/governance/gauges',
                    'label': 'Validator',
                    'stateAccount': '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC',
                },
            ],
            'proposals': {
                'discussion': {
                    'link': 'https://forum.marinade.finance/',
                    'prefix': 'https://forum.marinade.finance/t/',
                    'required': true,
                },
                'notice': 'To create a proposal, first make a post on the [Marinade Governance Forum](https://forum.marinade.finance/).\n\n\nOnce you have determined that there is sufficient community support, add the link to the discussion thread and create a proposal.\n',
            },
            'slug': 'mnde',
        },
        {
            'address': '9tnpMysuibKx6SatcH3CWR9ZsSRMBNeBf1mhfL6gAXR4',
            'addresses': {
                'electorate': {
                    'address': '4tr9CDSgZRLYPGdcsm9PztaGSfJtX5CEmqDbEbvCTX2G',
                    'label': 'Electorate',
                },
                'emergency-dao': {
                    'address': 'F9TxY3Bj1tWebTHZPJC323WK8KwAe3W6XKkg2hzCdsKM',
                    'label': 'Emergency DAO',
                    'type': 'smart-wallet',
                },
                'executive-council': {
                    'address': 'ByB3GkPHuUBmzcNbY1Ed7xK2uMkEkNsxTwjMGAFeLsbw',
                    'label': 'Executive Council',
                    'type': 'smart-wallet',
                },
                'governor': {
                    'address': '9tnpMysuibKx6SatcH3CWR9ZsSRMBNeBf1mhfL6gAXR4',
                    'label': 'Governor',
                },
                'smart-wallet': {
                    'address': 'F9TxY3Bj1tWebTHZPJC323WK8KwAe3W6XKkg2hzCdsKM',
                    'label': 'Smart Wallet',
                    'type': 'smart-wallet',
                },
            },
            'description': 'AMM for mean-reverting trading pairs on Solana',
            'gauge': {
                'gaugemeister': '28ZDtf6d2wsYhBvabTxUHTRT6MDxqjmqR7RMCp348tyU',
            },
            'govToken': {
                'address': 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',
                'chainId': 101,
                'decimals': 6,
                'extensions': {
                    'coingeckoId': 'saber',
                    'discord': 'https://chat.saber.so',
                    'github': 'https://github.com/saber-hq',
                    'medium': 'https://blog.saber.so',
                    'serumV3Usdc': 'HXBi8YBwbh4TXF6PjVw81m8Z3Cc4WBofvauj5SBFdgUs',
                    'twitter': 'https://twitter.com/saber_hq',
                    // 'waterfallbot': 'https://bit.ly/SBRwaterfall',
                    'website': 'https://saber.so',
                },
                'logoURI': 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1.svg',
                'name': 'Saber Protocol Token',
                'symbol': 'SBR',
                'tags': [
                    'saber-hidden',
                ],
            },
            'governance': {
                'address': '9tnpMysuibKx6SatcH3CWR9ZsSRMBNeBf1mhfL6gAXR4',
                'description': 'AMM for mean-reverting trading pairs on Solana',
                'iconURL': 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1.svg',
                'name': 'Saber',
                'network': 'mainnet-beta',
                'parameters': {
                    'governor': {
                        'quorumVotes': new BN('400000000000000'),
                        'timelockDelay': 86400,
                        'votingDelay': 86400,
                        'votingPeriod': 259200,
                        'proposalActivationMinVotes': '10000000000000',
                    },
                    'locker': {
                        'maxStakeDuration': 157680000,
                        'maxStakeVoteMultiplier': 10,
                        'minStakeDuration': 604800,
                        'proposalActivationMinVotes': new BN('10000000000000'),
                        'whitelistEnabled': true,
                        'quorumVotes': '400000000000000',
                    },
                },
                'slug': 'sbr',
                'token': {
                    'address': 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',
                    'chainId': 101,
                    'decimals': 6,
                    'extensions': {
                        'coingeckoId': 'saber',
                        'discord': 'https://chat.saber.so',
                        'github': 'https://github.com/saber-hq',
                        'medium': 'https://blog.saber.so',
                        'serumV3Usdc': 'HXBi8YBwbh4TXF6PjVw81m8Z3Cc4WBofvauj5SBFdgUs',
                        'twitter': 'https://twitter.com/saber_hq',
                        // 'waterfallbot': 'https://bit.ly/SBRwaterfall',
                        'website': 'https://saber.so',
                    },
                    'logoURI': 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1.svg',
                    'name': 'Saber Protocol Token',
                    'symbol': 'SBR',
                    'tags': [
                        'saber-hidden',
                    ],
                },
            },
            'iconURL': 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1.svg',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://app.saber.so',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://chat.saber.so',
                },
                'forum': {
                    'label': 'Forum',
                    'url': 'https://github.com/saber-hq/governance/discussions/',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/saber-hq',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://blog.saber.so',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/saber_hq',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://saber.so',
                },
            },
            'minter': {
                'mintWrapper': 'EVVDA3ZiAjTizemLGXNUN3gb6cffQFEYkFjFZokPmUPz',
                'redeemer': 'CL9wkGFT3SZRRNa9dgaovuRV7jrVVigBUZ6DjcgySsCU',
            },
            'name': 'Saber',
            'proposals': {
                'discussion': {
                    'link': 'https://github.com/saber-hq/governance/issues/new?assignees=&labels=proposal&template=governance-proposal.md&title=%5BPROPOSAL%5D',
                    'prefix': 'https://github.com/saber-hq/governance/issues/',
                    'required': true,
                },
                'notice': 'To create a proposal, first make a proposal on the [Saber Governance Forum](https://github.com/saber-hq/governance/issues/new?assignees=&labels=proposal&template=governance-proposal.md&title=%5BPROPOSAL%5D).\n\nOnce you have determined that there is sufficient community support,\nadd the link to the discussion thread and create a proposal.\n',
            },
            'quarry': {
                'additionalRewarders': [
                    '2UsGfm8S36eW58U4JeKgVC9fcXsqf7D6vfm4GHUtnENn',
                    'CXer5v3osVQFDWUB3SJUPB1PN1dB3dQSQfymyAnmCryp',
                    'Wz2Zzi5BHmYr75yNzJG8NZ8U1T9cSWKf6ATRwZF7qV6',
                    '9eNj2Y4YdqM9Unw8qTm8kzx1Xt64Rft8a6HjvpkPL7QJ',
                ],
                'features': [
                    'issue-tokens',
                ],
                'gauge': {
                    'gaugemeister': new PublicKey('28ZDtf6d2wsYhBvabTxUHTRT6MDxqjmqR7RMCp348tyU'),
                },
                'mintWrapper': 'EVVDA3ZiAjTizemLGXNUN3gb6cffQFEYkFjFZokPmUPz',
                'operator': {
                    'address': new PublicKey('GdW7Accmjusk8qKUPoCMJasEje63h97igqkjdEpacpRN'),
                    'features': [
                        'set-annual-rewards-rate',
                    ],
                },
                'redeemer': 'CL9wkGFT3SZRRNa9dgaovuRV7jrVVigBUZ6DjcgySsCU',
                'rewarder': 'rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk',
            },
            'slug': 'sbr',
        },
    ],
}


