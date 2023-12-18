import { storage } from "src/storage";
import { decrypt, encrypt } from "src/utils/en";
import { getElement } from "src/utils/getElement";

const state = { value: "", encrypted: "", key: "" };

const onSubmit = async () => {
  const el = document.getElementById("editable-message-text") as HTMLElement;
  el.textContent = "::encrypted:: " + state.encrypted;
  const event = new Event("input", { bubbles: true });
  el.dispatchEvent(event);
};

const parseEncryptedData = () => {
  const elements = document.querySelectorAll("[data-sid]");
  elements.forEach(async (el) => {
    if (!el.textContent?.startsWith("::encrypted::")) return;
    const target = el.querySelector("span") as HTMLElement;
    if (!target) return;
    try {
      const data = await decrypt(
        target.textContent!.replace("::encrypted::", ""),
        state.key
      );
      target.textContent = data;
    } catch (error) {
      target.textContent = "خطا در decryption";
    }
  });
};

(async function init() {
  const { key, enable } = await storage.get();
  state.key = key;
  if (!enable) return;

  const mainApp = (await getElement("#app_main_wrapper")) as HTMLElement;
  const el = (await getElement("#editable-message-text")) as HTMLDivElement;

  el.addEventListener("input", async (e) => {
    state.value = (e.target as HTMLElement).innerText;
    state.encrypted = await encrypt(state.value, state.key);
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && state.value !== "") onSubmit();
  });

  const chatWrapper = mainApp.children[2];
  const observer = new MutationObserver(parseEncryptedData);
  observer.observe(chatWrapper, { childList: true, subtree: true });
})();
