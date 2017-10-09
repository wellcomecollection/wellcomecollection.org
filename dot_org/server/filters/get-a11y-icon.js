const slugIconMap = {
  'british-sign-language': 'a11y/sign_language',
  'speech-to-text': 'a11y/speech_to_text',
  'audio-description': 'a11y/audio_description',
  'british-sign-language-tour': 'a11y/sign_language',
  'speech-to-text-tour': 'a11y/speech_to_text'
};

export default (slug) => {
  return slugIconMap[slug];
};
