import { FunctionComponent } from 'react';
import { ExhibitionGuideComponent } from '@weco/content/types/exhibition-guides';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Stop, { getTypeColor } from './ExhibitionCaptions.Stop';
import NewStop from './ExhibitionCaptions.Stop.New';
import { useToggles } from '@weco/common/server-data/Context';

type Props = {
  stops: ExhibitionGuideComponent[];
};

function includesStandaloneTitle(stop: ExhibitionGuideComponent): boolean {
  return stop.captionsOrTranscripts
    ? stop.captionsOrTranscripts.standaloneTitle.length > 0
    : false;
}

const ExhibitionCaptions: FunctionComponent<Props> = ({ stops }) => {
  const { egWork } = useToggles();

  const titlesUsed = {
    standalone: false,
    context: false,
  };

  return (
    <article>
      {stops.map((stop, index) => {
        const hasStandaloneTitle = includesStandaloneTitle(stop);

        // We want to know whether a standalone title and/or a context title has been used
        // so we can decrease subsequent headings to the appropriate level
        if (!titlesUsed.standalone) {
          titlesUsed.standalone = hasStandaloneTitle;
        }
        if (!titlesUsed.context) {
          titlesUsed.context = isNotUndefined(
            stop.captionsOrTranscripts?.context
          );
        }
        return egWork ? (
          <NewStop
            key={index}
            index={index}
            stop={stop}
            isFirstStop={index === 0}
            titlesUsed={titlesUsed}
            hasStandaloneTitle={hasStandaloneTitle}
          />
        ) : (
          <Stop
            key={index}
            index={index}
            stop={stop}
            isFirstStop={index === 0}
            titlesUsed={titlesUsed}
            hasStandaloneTitle={hasStandaloneTitle}
          />
        );
      })}
    </article>
  );
};

export { getTypeColor };
export default ExhibitionCaptions;
