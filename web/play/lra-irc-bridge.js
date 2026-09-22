/*
 * LRA IRC bridge v0.1
 * Transport adapter only. Inform remains the simulation/evidence authority.
 * Configure an Ergo WebSocket endpoint at runtime; no credentials live here.
 */
(() => {
  "use strict";

  const state = { socket: null, endpoint: null, channel: null, nick: null };

  const emit = (detail) =>
    window.dispatchEvent(new CustomEvent("lra:irc", { detail: {
      epistemic_status: "EXTERNAL_DIALOGUE", ...detail
    }}));

  function connect({ endpoint, nick }) {
    if (!/^wss:\/\//i.test(endpoint || "")) throw new Error("LRA IRC requires a secure wss:// endpoint");
    disconnect();
    state.endpoint = endpoint;
    state.nick = nick || ("lra-" + Math.random().toString(36).slice(2, 8));
    const ws = new WebSocket(endpoint, ["irc"]);
    state.socket = ws;
    ws.addEventListener("open", () => {
      ws.send("CAP LS 302\r\n");
      ws.send("NICK " + state.nick + "\r\n");
      ws.send("USER " + state.nick + " 0 * :Lattice Reconstruction Agents visitor\r\n");
      emit({ type: "STATUS", status: "connected", nick: state.nick });
    });
    ws.addEventListener("message", (event) => {
      const lines = String(event.data).split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        if (/^PING /.test(line)) ws.send("PONG " + line.slice(5) + "\r\n");
        emit({ type: "RECEIVE", channel: state.channel, content: line });
      }
    });
    ws.addEventListener("close", () => emit({ type: "STATUS", status: "disconnected" }));
    ws.addEventListener("error", () => emit({ type: "STATUS", status: "error" }));
  }

  function requireOpen() {
    if (!state.socket || state.socket.readyState !== WebSocket.OPEN) throw new Error("IRC is not connected");
  }
  function join(channel) {
    requireOpen();
    if (!/^#[A-Za-z0-9_+.-]+$/.test(channel)) throw new Error("Invalid IRC channel");
    state.channel = channel;
    state.socket.send("JOIN " + channel + "\r\n");
    emit({ type: "SEND", command: "JOIN", channel });
  }
  function say(message, channel = state.channel) {
    requireOpen();
    if (!channel) throw new Error("Join a channel first");
    const clean = String(message).replace(/[\r\n]/g, " ").slice(0, 400);
    state.socket.send("PRIVMSG " + channel + " :" + clean + "\r\n");
    emit({ type: "SEND", command: "PRIVMSG", channel, content: clean });
  }
  function who(channel = state.channel) {
    requireOpen();
    if (!channel) throw new Error("Join a channel first");
    state.socket.send("WHO " + channel + "\r\n");
  }
  function leave(channel = state.channel) {
    requireOpen();
    if (channel) state.socket.send("PART " + channel + " :Leaving LRA context\r\n");
    if (state.channel === channel) state.channel = null;
  }
  function disconnect() {
    if (state.socket) {
      try { state.socket.close(1000, "LRA disconnect"); } catch (_) {}
    }
    state.socket = null; state.channel = null;
  }

  window.LRA_IRC = Object.freeze({ connect, join, say, who, leave, disconnect, state });
})();
