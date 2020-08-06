<template>
  <div class="hello">
    <h1>Youtube Downloader</h1>
    <div class="container" v-if="!loading">
      <validation-observer ref="form" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(download)">
          <div class="field-group" v-for="(field, i) in fields" :key="i">
            <validation-provider class="input" rules="required|youtubeURL" v-slot="{ errors }">
              <input
                v-model="field.videoURL"
                placeholder="https://www.youtube.com/watch?v=H_3JiTfmuzg"
              />
              <div class="error">{{ errors[0] }}</div>
              <div class="error">{{ errors[1] }}</div>
            </validation-provider>
            <validation-provider class="select" rules="required" v-slot="{ errors }">
              <select v-model="field.type">
                <option value="video">MP4</option>
                <option value="audio">MP3</option>
              </select>
              <span class="error">{{ errors[0] }}</span>
            </validation-provider>
            <button class="closeButton" @click="deleteField(i)" v-if="i !== 0">X</button>
          </div>
          <div class="bottom">
            <button @click="addField">Ajouter un champs</button>
            <button type="reset" @click="resetFields">Réinitialiser</button>
            <button type="submit">Envoyer</button>
          </div>
        </form>
      </validation-observer>
    </div>

    <div v-if="loading">Loading</div>
    <div v-if="!loading && downloadURL">
      <h2>{{ filename }}</h2>
      <a :href="downloadURL" :download="filename">Télécharger</a>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import useFetchVideo from "../composables/fetchVideo";

export default {
  name: "Home",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  setup(props, { refs }) {
    const fields = ref([
      {
        videoURL: "",
        type: "video"
      }
    ]);

    const choices = computed(() => ({
      userChoices: fields.value
    }));

    function addField() {
      fields.value.push({
        videoURL: "",
        type: "video"
      });
    }

    function deleteField(index) {
      fields.value.splice(index, 1);
    }

    function resetFields() {
      watch(fields, () => refs.form.reset());
      fields.value = [
        {
          videoURL: "",
          type: "video"
        }
      ];
    }

    const { filename, downloadURL, loading, download } = useFetchVideo(choices);

    return {
      fields,
      download,
      loading,
      filename,
      downloadURL,
      addField,
      deleteField,
      resetFields
    };
  }
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
  max-width: 1200px;
  margin: 0 auto;

  & .field-group {
    display: grid;
    grid-template-columns: 4fr auto auto;
    position: relative;

    .input {
      width: 100%;
    }

    & input {
      width: 100%;
      padding: 0;
      margin: 0;
      font-size: 1.5em;
    }
    & select {
      font-size: 1.5em;
    }
  }

  .closeButton {
    position: absolute;
    right: 0;
    transform: translate(100%);
  }

  .bottom {
    width: 100%;
  }

  .error {
    color: red;
  }
}
</style>
