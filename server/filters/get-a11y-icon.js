const slugIconMap = {
  'british-sign-language': 'a11y/sign_language',
  'speech-to-text': 'a11y/text_to_speech',
  'audio-description': 'a11y/audio_description',
  'british-sign-language-tour': 'a11y/sign_language',
  'speech-to-text-tour': 'a11y/text_to_speech'
};

export default (slug) => {
  return slugIconMap[slug];
};
