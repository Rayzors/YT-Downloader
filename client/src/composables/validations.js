import { extend } from 'vee-validate';

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
