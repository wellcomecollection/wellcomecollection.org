/**
 * Primary content in *AudioPlayer → Primary*
 */
export interface AudioPlayerSliceDefaultPrimary {
  /**
   * Title field in *AudioPlayer → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: *None*
   * - **API ID Path**: audioPlayer.primary.title
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  title: prismic.TitleField;

  /**
   * Audio field in *AudioPlayer → Primary*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: audioPlayer.primary.audio
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  audio: prismic.LinkToMediaField;

  /**
   * Transcript (Collapsible content) field in *AudioPlayer → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: audioPlayer.primary.transcript
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  transcript: prismic.RichTextField;
}

/**
 * Default variation for AudioPlayer Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type AudioPlayerSliceDefault = prismic.SharedSliceVariation<
  'default',
  Simplify<AudioPlayerSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *AudioPlayer*
 */
type AudioPlayerSliceVariation = AudioPlayerSliceDefault;

/**
 * AudioPlayer Shared Slice
 *
 * - **API ID**: `audioPlayer`
 * - **Description**: AudioPlayer
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type AudioPlayerSlice = prismic.SharedSlice<
  'audioPlayer',
  AudioPlayerSliceVariation
>;
