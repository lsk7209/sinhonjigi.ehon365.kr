import { execFileSync, spawn } from "node:child_process";
import process from "node:process";

const projectRoot = process.cwd();
const isWindows = process.platform === "win32";
const cleanOnly = process.argv.includes("--clean");
const forwardedArgs = process.argv.slice(2).filter((arg) => arg !== "--clean");

function normalizePath(value) {
  return value.replaceAll("\\", "/").toLowerCase();
}

function listNodeProcesses() {
  if (!isWindows) {
    return [];
  }

  const command = [
    "Get-CimInstance Win32_Process -Filter \"name = 'node.exe'\"",
    "Select-Object ProcessId,ParentProcessId,CommandLine",
    "ConvertTo-Json -Compress",
  ].join(" | ");

  const output = execFileSync(
    "powershell.exe",
    ["-NoProfile", "-Command", command],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();

  if (!output) {
    return [];
  }

  const parsed = JSON.parse(output);
  return Array.isArray(parsed) ? parsed : [parsed];
}

function killProcess(pid) {
  try {
    process.kill(Number(pid), "SIGTERM");
  } catch {
    execFileSync("powershell.exe", [
      "-NoProfile",
      "-Command",
      `Stop-Process -Id ${Number(pid)} -Force -ErrorAction SilentlyContinue`,
    ]);
  }
}

function projectNodeProcesses() {
  const root = normalizePath(projectRoot);
  return listNodeProcesses().filter((entry) => {
    const commandLine = normalizePath(entry.CommandLine ?? "");
    return commandLine.includes(root);
  });
}

function isCurrentProcess(entry) {
  return Number(entry.ProcessId) === process.pid;
}

function isNextDevProcess(entry) {
  const commandLine = normalizePath(entry.CommandLine ?? "");
  return (
    commandLine.includes("/next/dist/bin/next") &&
    /\bdev\b/.test(commandLine)
  );
}

function isNextBuildWorker(entry) {
  const commandLine = normalizePath(entry.CommandLine ?? "");
  return commandLine.includes("/.next/dev/build/postcss.js");
}

function isDevGuardProcess(entry) {
  const commandLine = normalizePath(entry.CommandLine ?? "");
  return commandLine.includes("scripts/dev-guard.mjs");
}

function collectDescendantPids(entries, rootPids) {
  const descendants = new Set();
  const queue = [...rootPids].map(Number);

  while (queue.length > 0) {
    const parentPid = queue.shift();
    for (const entry of entries) {
      const pid = Number(entry.ProcessId);
      if (
        Number(entry.ParentProcessId) === parentPid &&
        !descendants.has(pid)
      ) {
        descendants.add(pid);
        queue.push(pid);
      }
    }
  }

  return descendants;
}

function cleanStaleWorkers({ includeAllProjectNodes = false } = {}) {
  const targets = projectNodeProcesses().filter((entry) => {
    if (isCurrentProcess(entry)) {
      return false;
    }

    return includeAllProjectNodes || isNextBuildWorker(entry);
  });

  for (const target of targets) {
    killProcess(target.ProcessId);
  }

  return targets.length;
}

function cleanDevProcesses() {
  if (!isWindows) {
    return 0;
  }

  const entries = projectNodeProcesses().filter((entry) => {
    return !isCurrentProcess(entry);
  });
  const devPids = entries.filter(isNextDevProcess).map((entry) => {
    return Number(entry.ProcessId);
  });
  const descendantPids = collectDescendantPids(entries, devPids);
  const targets = entries.filter((entry) => {
    const pid = Number(entry.ProcessId);
    return (
      devPids.includes(pid) ||
      descendantPids.has(pid) ||
      isNextBuildWorker(entry) ||
      isDevGuardProcess(entry)
    );
  });

  for (const target of targets) {
    killProcess(target.ProcessId);
  }

  return targets.length;
}

if (isWindows) {
  const existingDev = projectNodeProcesses().filter(
    (entry) => !isCurrentProcess(entry) && isNextDevProcess(entry),
  );

  if (cleanOnly) {
    const killed = cleanDevProcesses();
    console.log(`Cleaned ${killed} Next dev process(es) for ${projectRoot}.`);
    process.exit(0);
  }

  if (existingDev.length > 0) {
    console.error("A Next dev server is already running for this project:");
    for (const entry of existingDev) {
      console.error(`- pid ${entry.ProcessId}: ${entry.CommandLine}`);
    }
    console.error("Run `npm run dev:clean` first if these processes are stale.");
    process.exit(1);
  }

  const killed = cleanStaleWorkers();
  if (killed > 0) {
    console.log(`Cleaned ${killed} stale Next build worker(s).`);
  }
}

const nextBin = isWindows
  ? "node_modules\\.bin\\next.cmd"
  : "node_modules/.bin/next";
const hasBundlerArg = forwardedArgs.some((arg) => {
  return arg === "--webpack" || arg === "--turbo" || arg === "--turbopack";
});
const devArgs = ["dev", ...(hasBundlerArg ? [] : ["--webpack"]), ...forwardedArgs];

const command = isWindows ? process.env.ComSpec ?? "cmd.exe" : nextBin;
const args = isWindows
  ? ["/d", "/s", "/c", nextBin, ...devArgs]
  : devArgs;

const child = spawn(command, args, {
  cwd: projectRoot,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
  },
  shell: false,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    cleanDevProcesses();
    process.exit(signal === "SIGINT" ? 130 : 143);
  });
}

child.on("exit", (code, signal) => {
  cleanStaleWorkers();

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
