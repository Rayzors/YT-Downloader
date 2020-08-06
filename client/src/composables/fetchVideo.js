import { ref } from '@vue/composition-api';

export default function(userChoices) {
  const filename = ref(null);
  const downloadURL = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const download = async function() {
    try {
      loading.value = true;
      const res = await fetch(`${process.env.VUE_APP_API_URL}/video`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userChoices.value),
      });

      const blob = await res.blob();
      filename.value = getFilenameFromHeader(res);
      downloadURL.value = window.URL.createObjectURL(blob);
      // window.URL.revokeObjectURL(downloadURL.value);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { filename, downloadURL, loading, error, download };
}

function getFilenameFromHeader(response) {
  const string = response.headers.get('Content-Disposition');
  const regex = /filename="([\w_]+.\w{3})"/;
  const matches = string.match(regex);

  return matches[1];
}
