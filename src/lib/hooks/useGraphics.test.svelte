<script lang="ts">
  import useGraphics from './useGraphics';

  interface Props {
    src ?: string;
    setGraphics ?: (() => Record<string, string>);
    renderGraphic ?: ((src : string) => void);
  }

  const props : Props = $props();

  const {
    graphics,
    renderGraphic,
  } = useGraphics();

  $effect(() => {
    if (props.setGraphics) graphics.set(props.setGraphics());
    if (props.src && props.renderGraphic)
      props.renderGraphic(renderGraphic(props.src));
  });
</script>
