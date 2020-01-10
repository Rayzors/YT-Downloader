<template>
  <div class="hello">
    <h1>Youtube Downloader</h1>
    <div class="container" v-if="!loading">
      <div class="left">
        <validation-provider rules="required|youtubeURL" v-slot="{ errors }">
          <input
            v-model="url"
            placeholder="https://www.youtube.com/watch?v=H_3JiTfmuzg"
          />
          <div class="error">{{ errors[0] }}</div>
          <div class="error">{{ errors[1] }}</div>
        </validation-provider>
      </div>
      <div class="right">
        <validation-provider rules="required" v-slot="{ errors }">
          <select v-model="type">
            <option value="video">MP4</option>
            <option value="audio">MP3</option>
          </select>
          <span class="error">{{ errors[0] }}</span>
        </validation-provider>

        <button @click="download">Envoyer</button>
      </div>
    </div>

    <div v-if="loading">
      Loading
    </div>
    <div v-if="!loading && downloadURL">
      <h2>{{ filename }}</h2>
      <a :href="downloadURL" :download="filename">Télécharger</a>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'Ce champ est requis',
});

extend('youtubeURL', {
  validate: (value) => {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/;
    const matches = value.match(regex);
    if (matches) {
      return true;
    }
  },
  message: "Ceci n'est pas un lien Youtube",
});

export default {
  name: 'Home',
  components: {
    ValidationProvider,
  },
  setup() {
    const url = ref('');
    const loading = ref(false);
    const downloadURL = ref(null);
    const filename = ref(null);
    const type = ref('');

    async function download() {
      const choices = {
        userChoices: [{ videoURL: url.value, type: type.value }],
      };
      loading.value = true;
      const res = await fetch('http://localhost:4444/video', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(choices),
      });

      const blob = await res.blob();
      filename.value = getFilenameFromHeader(res);
      downloadURL.value = window.URL.createObjectURL(blob);
      // window.URL.revokeObjectURL(downloadURL.value);
      loading.value = false;
      url.value = null;
    }

    function getFilenameFromHeader(response) {
      const string = response.headers.get('Content-Disposition');
      const regex = /filename="([\w_]+.\w{3})"/;
      const matches = string.match(regex);

      return matches[1];
    }

    return {
      url,
      download,
      loading,
      downloadURL,
      filename,
      type,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;

  & .left {
    width: 70%;

    & input {
      width: 100%;
      padding: 0;
      margin: 0;
      font-size: 1.5em;
    }
  }

  & .right {
    & select {
      font-size: 1.5em;
    }
  }

  .error {
    color: red;
  }
}
</style>
