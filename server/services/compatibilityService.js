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

const checkPsuWattage = (cpu, gpu, psu) => {
  const cpuDraw = Number(cpu.specs.get("powerDraw"));
  const gpuDraw = Number(gpu.specs.get("powerDraw"));
  const psuWattage = Number(psu.specs.get("wattage"));

  if (!cpuDraw || !gpuDraw || !psuWattage) {
    return {
      compatible: false,
      reason: "Power draw or wattage information missing for one or more components",
    };
  }

  const totalDraw = cpuDraw + gpuDraw;
  const recommendedWattage = Math.ceil(totalDraw * 1.2); // 20% safety margin

  if (psuWattage >= recommendedWattage) {
    return {
      compatible: true,
      reason: `PSU (${psuWattage}W) comfortably covers total draw (${totalDraw}W) with safety margin`,
    };
  }

  if (psuWattage >= totalDraw) {
    return {
      compatible: true,
      warning: true,
      reason: `PSU (${psuWattage}W) covers total draw (${totalDraw}W) but has little headroom — recommended at least ${recommendedWattage}W`,
    };
  }

  return {
    compatible: false,
    reason: `PSU (${psuWattage}W) is insufficient for total draw (${totalDraw}W)`,
  };
};

module.exports = { checkCpuMotherboard, checkRamMotherboard, checkPsuWattage };