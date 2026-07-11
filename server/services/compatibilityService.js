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


// NEW
const checkRamMotherboard = (ram, motherboard) => {
  const ramType = ram.specs.get("type");
  const supportedType = motherboard.specs.get("ramType");

  if (!ramType || !supportedType) {
    return {
      compatible: false,
      reason: "RAM type information missing for RAM or Motherboard",
    };
  }

  if (ramType === supportedType) {
    return {
      compatible: true,
      reason: `RAM type (${ramType}) matches Motherboard's supported RAM type (${supportedType})`,
    };
  }

  return {
    compatible: false,
    reason: `RAM type mismatch: RAM is ${ramType}, Motherboard supports ${supportedType}`,
  };
};

module.exports = { checkCpuMotherboard, checkRamMotherboard };