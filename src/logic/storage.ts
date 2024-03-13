import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const profileList = useWebExtensionStorage<Profile[]>('configList', [])

interface Profile {
  form: Form
  config: ProxyConfig
}

interface Form {
  id: string
  name: string
  mode: 'direct' | 'auto_detect' | 'pac_script' | 'fixed_servers' | 'system'
  url?: string
  script?: string
}

interface ProxyConfig {
  mode: 'direct' | 'auto_detect' | 'pac_script' | 'fixed_servers' | 'system'
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

interface ProxyServer {
  host: string
  port?: number
  scheme?: 'http' | 'https' | 'quic' | 'socks4' | 'socks5'
}
