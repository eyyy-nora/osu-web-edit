<script>
import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
import OsuEditorStdMapView from "../rendered/OsuEditorStdMapView.svelte";
import ScreenBox from "../component/layout/ScreenBox.svelte";
import HitCircle_ from "../rendered/std/HitCircle.svelte";
import RankedArea from "../rendered/std/RankedArea.svelte";
</script>


<Meta
  title="rendered/std"
  component={HitCircle_}
/>

<Template let:args>
  <ScreenBox>
    <OsuEditorStdMapView>
      <RankedArea />
      <HitCircle_ {...args} />
    </OsuEditorStdMapView>
  </ScreenBox>
</Template>

<Story
  name="HitCircle"
/>
