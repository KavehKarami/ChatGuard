<script lang="ts">
  import { storage } from "src/storage";
  import { onMount } from "svelte";

  let value = "";
  let enable: any = true;

  const handleSubmit = async () => {
    const prev = await storage.get();
    storage.set({ ...prev, key: value });
  };

  onMount(async () => {
    const p = await storage.get();
    value = p.key;
    enable = p.enable;
  });
  const handleCheckbox = async (en: any) => {
    const p = await storage.get();
    storage.set({ ...p, enable: en ? true : false });
  };

  $: handleCheckbox(enable);
</script>

<div class="wrapper">
  <h1 class="title">ENC (beta)</h1>
  <div class="form">
    active:
    <input bind:checked={enable} type="checkbox" name="" id="" />
  </div>

  <form class="form" on:submit|preventDefault={handleSubmit}>
    <input class="input" type="text" placeholder="encryption key" bind:value />
    <button class="button" type="submit">change</button>
  </form>
</div>

<style module>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :global(body) {
    background-color: #000000;
    color: #fff;
  }
  .title {
    font-size: 1.2rem;
  }
  .wrapper {
    padding: 2rem;
    width: 24rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 1.2rem;
  }
  .form {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .input {
    padding: 0.5rem;
    border: 0.2rem solid rgb(239, 239, 239);
    border-radius: 0.5rem;
    width: 100%;
  }
  .button {
    padding: 0.6rem 1rem;
    border-radius: 0.5rem;
  }
</style>
