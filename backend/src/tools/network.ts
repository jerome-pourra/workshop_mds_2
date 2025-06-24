import * as os from 'os';

export function getWifiIpv4Address() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    if (networkInterface && interfaceName === 'Wi-Fi') {
      for (const network of networkInterface) {
        if (network.family === 'IPv4' && !network.internal) {
          return network.address;
        }
      }
    }
  }
  return null;
}
