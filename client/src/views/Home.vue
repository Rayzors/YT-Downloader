<template>
  <div class="hello">
    <h1>Youtube Downloader</h1>
    <div class="container" v-if="!loading">
      <div class="left">
        <div v-for="(field, i) in fields" :key="i">
          <validation-provider rules="required|youtubeURL" v-slot="{ errors }">
            <input
              v-model="field.videoURL"
              placeholder="https://www.youtube.com/watch?v=H_3JiTfmuzg"
            />
            <div class="error">{{ errors[0] }}</div>
            <div class="error">{{ errors[1] }}</div>
          </validation-provider>
          <button @click="deleteField(i)">X</button>
        </div>
      </div>
      <div class="right">
        <div v-for="(field, i) in fields" :key="i">
          <validation-provider rules="required" v-slot="{ errors }">
            <select v-model="field.type">
              <option value="video">MP4</option>
              <option value="audio">MP3</option>
            </select>
            <span class="error">{{ errors[0] }}</span>
          </validation-provider>
        </div>
      </div>
      <button @click="addField">Ajouter un champs</button>
      <button @click="download">Envoyer</button>
    </div>

    <div v-if="loading">Loading</div>
    <div v-if="!loading && downloadURL">
      <h2>{{ filename }}</h2>
      <a :href="downloadURL" :download="filename">Télécharger</a>
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';
import { ValidationProvider, extend } from 'vee-validate';
import useFetchVideo from '../composables/fetchVideo';

extend('required', {
  validate: (value) => {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1,
    };
  },
  computesRequired: true,
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
    const type = ref('video');
    const fields = ref([
      {
        videoURL: '',
        type: 'video',
      },
    ]);

    const choices = computed(() => ({
      userChoices: fields.value,
    }));

    const addField = function() {
      fields.value.push({
        videoURL: '',
        type: 'video',
      });
    };

    const deleteField = function(index) {
      fields.value.splice(index, 1);
    };

    const { filename, downloadURL, loading, download } = useFetchVideo(choices);

    return {
      fields,
      download,
      loading,
      filename,
      downloadURL,
      type,
      addField,
      deleteField,
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
