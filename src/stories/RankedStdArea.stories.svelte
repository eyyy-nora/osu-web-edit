<script>
import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
import RankedArea_ from "../rendered/std/RankedArea.svelte";
import OsuEditorStdMapView from "../rendered/OsuEditorStdMapView.svelte";
import ScreenBox from "../component/layout/ScreenBox.svelte";
</script>


<Meta
  title="rendered/std"
  component={RankedArea_}
/>

<Template let:args>
  <ScreenBox>
    <OsuEditorStdMapView>
      <RankedArea_ {...args} />
    </OsuEditorStdMapView>
  </ScreenBox>
</Template>

<Story
  name="RankedArea"
/>
