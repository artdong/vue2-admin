<template>
    <div style="padding: 12px;">
        <tinymce-editor api-key="API_KEY" :init="{plugins: 'wordcount'}"></tinymce-editor>
    </div>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue';

  export default {
    props: {
    },
    components: {
        'tinymce-editor': Editor // <- Important part
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
</style>
