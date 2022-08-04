<script lang="ts">
  import { runAIMod } from "src/aimod/aimod-check";
  import Button from "src/component/form/Button.svelte";
  import Panel from "src/component/page/Panel.svelte";
  import { getMapsetContext } from "src/context";
  import { Beatmap } from "src/io";
  import Dialog from "../component/page/Dialog.svelte";
  import { OwoId } from "src/icons";

  const context = getMapsetContext();
  const { beatmap, mapset, audio } = context;

  const beatmapAudioFile = audio.audio;

  let beatmapIssues: any[];
  $: beatmapIssues = runAIMod($beatmap ?? ({} as Beatmap), $mapset?.files, $beatmapAudioFile) ?? [];

  function iconForIssue(issue: string) {
    switch (issue) {
      case "Object concurrency":
        return "osu-ring" as OwoId;

      case "Background not present":
        return "alt" as OwoId;
    }
  }

  let dialog: Dialog;

  export let open: boolean = false;

  export async function show() {
    await dialog.show();
  }

  export function hide() {
    dialog.hide();
  }
</script>

<Dialog bind:this={dialog} closable {open} heading="AIMod">
  <div class="warning-container">
    {#if $beatmap == undefined}
      <div class="message-container">
        <h3 class="message-title">No beatmap selected!</h3>
        <p class="message-txt">Import a beatmap by clicking <b>File > Import...</b> <br /> in the top menu.</p>
      </div>
    {:else if beatmapIssues.length > 0}
      {#each beatmapIssues as issue}
        <Panel heading={issue.error} icon={iconForIssue(issue.error)}>
          <div class="content-centered">
            <p class="issue-message">{issue.message}</p>

            {#if issue.buttonMessage != undefined}
              <Button text={issue.buttonMessage} on:click={() => issue.apply?.(context, dialog)} />
            {/if}
          </div>
        </Panel>
      {/each}
    {:else}
      <div class="message-container">
        <h3 class="message-title">Clear!</h3>
        <p class="message-txt">No issues were found in this beatmap.</p>
      </div>
    {/if}
  </div>
</Dialog>

<style>
  .warning-container {
    background-color: var(--colorBgDarker);
    height: 500px;
    width: 100%;

    border-radius: 0.3rem;

    overflow-y: scroll;
    overflow-x: hidden;
  }

  .message-container {
    height: 50%;
    width: 100%;

    align-items: center;

    flex-direction: column;
    display: flex;
  }

  .message-txt {
    text-align: center;
    user-select: none;
  }

  .issue-message {
    margin-top: 5px;
    margin-bottom: 10px;

    display: block;
    width: 350px;
    word-break: normal;
    word-wrap: break-word;
    white-space: normal;
  }

  .message-title {
    margin: auto;
    font-weight: bold;
    user-select: none;
  }

  .content-centered {
    text-align: center;
    align-items: center;
    justify-content: center;

    display: flex;
    flex-direction: column;
  }
</style>
