<script lang="ts">
export let horizontal = false;
export let vertical = false;
export let disabled = false;
</script>

<div class:disabled class:horizontal class:vertical />

<style>
div {
  background: var(--bgHandle);
  position: relative;
  width: 12px;
  height: 12px;
}

div.horizontal {
  width: 60px;
  left: 50%;
  margin-left: -30px;
}

div.vertical {
  height: 60px;
  top: 50%;
  margin-top: -30px;
}
</style>
