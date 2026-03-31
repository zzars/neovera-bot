import makeWAsocket, { useMultiFileAuthState, fetchLatestWaWebVersion } from "baileys";

const { state, saveCreds } = await useMultiFileAuthState('auth')
const { version } = await fetchLatestWaWebVersion()

const sock = makeWAsocket({
  version,
  auth: state,
  syncFullHistory: false,
  printQRInTerminal: false
});

if (!sock.authState.creds.registered) {
  const number = "62895802285200"
  const code = await sock.requestPairingCode(number, "NEOVERAA")
  console.log(code)
}

sock.ev.on("creds.update", saveCreds)