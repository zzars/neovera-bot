import makeWAsocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestWaWebVersion
} from "baileys";
import fs from "node:fs";

const { state, saveCreds } = await useMultiFileAuthState("auth");
const { version } = await fetchLatestWaWebVersion();

let sock;
const connectSock = async function (opts = {}) {
    console.log("Connecting socket..");
    sock = makeWAsocket({
        version,
        auth: state,
        syncFullHistory: false,
        printQRInTerminal: false
    });

    sock.ev.on("connection.update", update => {
        const { connection, lastDisconnect } = update;
        if (connection == "close") {
            console.log("Koneksi tertutup!");

            const logoutByUser =
                lastDisconnect?.error?.output?.statusCode ==
                DisconnectReason.loggedOut;

            if (logoutByUser) {
                if (fs.existsSync("./auth")) {
                    fs.rmSync("./auth", {
                        recursive: true,
                        force: true
                    });
                    console.log(
                        "logout by user or uncompleted pairing. auth folder deleted. program stopped (please wait)"
                    );

                    process.exit();
                }
            } else {
                sock.ev.removeAllListeners();
                sock.ws.close();
                sock = null;
                // await delay(5000)
                connectSock();
            }
        } else if (connection == "open") {
            console.log("Connection open");
        }
    });

    if (!sock.authState.creds.registered) {
        const number = "62895802285200";
        const code = await sock.requestPairingCode(number, "NEOVERAA");
        console.log(code);
    }

    sock.ev.on("message.upsert", event => {
        for (const m of event.messages) {
            console.log(JSON.stringify(m, undefined, 2));
            // Handle message
        }
    });

    sock.ev.on("creds.update", saveCreds);
};

connectSock();
