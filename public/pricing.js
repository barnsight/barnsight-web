const pricingLocale = window.APP_LOCALE === "en" ? "en" : "uk";

const copy = {
  uk: {
    base: "База платформи",
    barns: "Господарства",
    cameras: "Камери",
    devices: "Edge-пристрої",
    storage: "Зберігання snapshot",
    analytics: "Аналітика та звіти",
    support: "Підтримка",
    training: "Підтримка тренування моделей",
    planPilot: "Підходить для пілота або одного господарства.",
    planOps: "Підходить для активного мульти-барн сценарію.",
    planEnterprise: "Потрібен enterprise rollout і кастомна комерційна модель.",
  },
  en: {
    base: "Platform base",
    barns: "Barns",
    cameras: "Cameras",
    devices: "Edge devices",
    storage: "Snapshot storage",
    analytics: "Analytics and reports",
    support: "Support",
    training: "Model training support",
    planPilot: "Best fit for a pilot or a single-site rollout.",
    planOps: "Best fit for active multi-barn operations.",
    planEnterprise: "Needs an enterprise rollout and a custom commercial model.",
  },
}[pricingLocale];

const formatter = new Intl.NumberFormat(pricingLocale === "en" ? "en-US" : "uk-UA", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const tabs = document.querySelectorAll(".pricing-tab");
const panels = document.querySelectorAll(".pricing-panel");
const barnsInput = document.getElementById("pricingBarns");
const camerasInput = document.getElementById("pricingCameras");
const devicesInput = document.getElementById("pricingDevices");
const storageInput = document.getElementById("pricingStorageGb");
const supportTierInput = document.getElementById("pricingSupportTier");
const analyticsTierInput = document.getElementById("pricingAnalyticsTier");
const snapshotsInput = document.getElementById("pricingSnapshots");
const trainingInput = document.getElementById("pricingTraining");
const output = document.getElementById("pricingOutput");
const breakdown = document.getElementById("pricingBreakdown");
const planHint = document.getElementById("pricingPlanHint");

function setActiveTab(target) {
  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.target === target);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.id !== `pricing-panel-${target}`);
  });
}

function calculate() {
  const barns = Number(barnsInput?.value || 1);
  const cameras = Number(camerasInput?.value || 1);
  const devices = Number(devicesInput?.value || 1);
  const storageGb = Number(storageInput?.value || 0);
  const snapshots = snapshotsInput?.checked;
  const training = trainingInput?.checked;
  const supportTier = supportTierInput?.value || "standard";
  const analyticsTier = analyticsTierInput?.value || "weekly";

  const base = 179;
  const barnsCost = Math.max(0, barns - 1) * 85;
  const camerasCost = cameras * 22;
  const devicesCost = devices * 42;
  const storageCost = snapshots ? Math.max(39, storageGb * 0.9) : 0;
  const analyticsCost = analyticsTier === "realtime" ? 249 : analyticsTier === "daily" ? 129 : 59;
  const supportCost = supportTier === "mission" ? 399 : supportTier === "priority" ? 199 : 79;
  const trainingCost = training ? 320 : 0;
  const total = Math.round(base + barnsCost + camerasCost + devicesCost + storageCost + analyticsCost + supportCost + trainingCost);

  output.textContent = formatter.format(total);
  breakdown.innerHTML = [
    [copy.base, base],
    [copy.barns, barnsCost],
    [copy.cameras, camerasCost],
    [copy.devices, devicesCost],
    [copy.storage, storageCost],
    [copy.analytics, analyticsCost],
    [copy.support, supportCost],
    [copy.training, trainingCost],
  ]
    .map(([label, value]) => `<li class="flex items-center justify-between gap-4 border-b border-paper/12 pb-3"><span>${label}</span><strong>${formatter.format(value)}</strong></li>`)
    .join("");

  if (total < 450) {
    planHint.textContent = copy.planPilot;
  } else if (total < 1200) {
    planHint.textContent = copy.planOps;
  } else {
    planHint.textContent = copy.planEnterprise;
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveTab(tab.dataset.target));
});

[barnsInput, camerasInput, devicesInput, storageInput, supportTierInput, analyticsTierInput, snapshotsInput, trainingInput]
  .filter(Boolean)
  .forEach((input) => {
    input.addEventListener("input", calculate);
    input.addEventListener("change", calculate);
  });

setActiveTab("plans");
calculate();
