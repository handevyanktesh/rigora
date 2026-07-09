// Pure logic — no Express, no req/res, just functions that take data and return results

const checkCpuMotherboard = (cpu, motherboard) => {
  const cpuSocket = cpu.specs.get("socket");
  const moboSocket = motherboard.specs.get("socket");

  if (!cpuSocket || !moboSocket) {
    return {
      compatible: false,
      reason: "Socket information missing for CPU or Motherboard",
    };
  }

  if (cpuSocket === moboSocket) {
    return {
      compatible: true,
      reason: `CPU socket (${cpuSocket}) matches Motherboard socket (${moboSocket})`,
    };
  }

  return {
    compatible: false,
    reason: `Socket mismatch: CPU requires ${cpuSocket}, Motherboard has ${moboSocket}`,
  };
};

module.exports = { checkCpuMotherboard };