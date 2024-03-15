import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const currentProfileId = useWebExtensionStorage<string>('currentProfileId', '')
export const profileList = useWebExtensionStorage<Profile[]>('configList', [])

export interface Profile {
  form: Form
  config: ProxyConfig
}
export type Mode = 'direct' | 'auto_detect' | 'pac_script' | 'fixed_servers' | 'system'

export interface Form {
  id: string
  name: string
  mode: Mode
  url: string
  script: string
  serverRules: ServerRule[]
  bypassText: string
  bypassList: string[]
}

export interface ServerRule {
  protocol: string
  scheme: string
  host: string
  port: string
}

export interface ProxyConfig {
  mode: Mode
  pacScript?: PacScript
  rules?: ProxyRules
}

interface PacScript {
  data?: string
  mandatory?: boolean
  url?: string
}

interface ProxyRules {
  bypassList?: string[]
  fallbackProxy?: ProxyServer
  proxyForFtp?: ProxyServer
  proxyForHttp?: ProxyServer
  proxyForHttps?: ProxyServer
  singleProxy?: ProxyServer
}

export type Scheme = 'http' | 'https' | 'quic' | 'socks4' | 'socks5'
interface ProxyServer {
  host: string
  port?: number
  scheme?: Scheme
}
