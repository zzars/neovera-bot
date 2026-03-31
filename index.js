import makeWAsocket, { useMultiFileAuthState, fetchLatestWaWebVersion } from "baileys";

const { state, saveCreds } = useMultiFileAuthStste('/auth')
const { version } = await fetchLatestWaWebVersion()

const sock = makeWAsocket({
  version,
  browser: Browsers.android("chrome"),
  syncFullHistory: true,
  printQRInTerminal: false
});

if (!sock.authState.creds.registered) {
  const number = "62895802285200"
  const code = await sock.requestPairingCode(number, "NEOVERAA")
  console.log(code)
}

sock.ev.on("creds.update", saveCreds)