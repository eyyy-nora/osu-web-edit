<script>
import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
import OsuEditorRankedArea from "../owo/OsuEditorRankedArea.svelte";
import OsuEditorStdMapView from "../owo/OsuEditorStdMapView.svelte";
import ScreenBox from "../component/layout/ScreenBox.svelte";
</script>


<Meta
  title="rendered/std"
  component={OsuEditorRankedArea}
/>

<Template let:args>
  <ScreenBox>
    <OsuEditorStdMapView>
      <OsuEditorRankedArea {...args} />
    </OsuEditorStdMapView>
  </ScreenBox>
</Template>

<Story
  name="RankedArea"
/>
