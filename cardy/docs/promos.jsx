// @flow

import BodyBlock from './BodyBlock';
import PageDescription from '../../common/views/components/PageDescription/PageDescription';

const DocsPromos = () => (
  <div>
    <PageDescription
      title='Promos'
      lead={true}
      meta={{value: `What's their purpose, what they aren't, and what the have the potential to become.`}} />
    <BodyBlock>
      <p id='whats_their_purpose'>
        A promo is how [content types from out domain](https://user-images.githubusercontent.com/31692/35921561-dc6e90bc-0c12-11e8-96c5-46a01573afd1.png)
        promote themselves across our sites, and externally, based on a
        combination of content, promotional, and contextual data.
      </p>
      <p>
        The purpose of a promo is to surface content that might be relevant to
        you, or your current context within our site, and allow you to decide
        whether you'd like to explore that content further whether it be through
        interest or curiosity.
      </p>
      <p>
        It's more obvious purpose is to give you a link to that content 🚀.
      </p>

      <img src='https://user-images.githubusercontent.com/31692/35923356-ea0a0030-0c17-11e8-8e99-4d28412b73cb.png'
           alt='An example of a promo using contextual, content, and promotional data' />

      <p>
        Using the example above example:
        <ul>
          <li>The "5" is contextual as this promo is in a list of ordered articles</li>
          <li>The series title is directly linked to the content of the article</li>
          <li>
            The text below the image has been created by editors to promote the article.
            It is not actually part of the article's body.
          </li>
        </ul>
      </p>

      <h2 id='what_they_arent'>What they aren't</h2>
      <p>Promos are not adverts, nor functional components.</p>
      <figure style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src='https://user-images.githubusercontent.com/31692/35924333-aa19db3c-0c1a-11e8-9451-36801b307bd3.png'
             alt='An image and text letting visitors know that there is a special menu at the Wellcome Kitchen'
             style={{ width: '300px' }} />
        <figcaption className="font-LR2-s">
          The above is not a promo, but rather an ad for a special menu at
          Wellcome Collection's kitchen
        </figcaption>
      </figure>

      <figure style={{ textAlign: 'center' }}>
        <img src='https://user-images.githubusercontent.com/31692/35924690-a1f9830c-0c1b-11e8-89c0-964eaeb397ed.png'
             alt={`An image of a component letting you sign up to Wellcome Collection's e-newsflyer`}
             style={{ width: '300px' }} />
        <figcaption className="font-LR2-s">
          The above is not a promo either, but rather an enticing newsletter
          signup component
        </figcaption>
      </figure>

      <h2>Potentialities</h2>
      <p>
        We would like to look at the difference between pull and push promos.
        i.e. content that we surface and allow you to chose from vs content we
        have deemed to be of special interest and thus promote more emphatically.
      </p>
      <p>
        Currently we only have image promos, we'd like to explore using more
        specialised promos for image galleries, videos, audio etc.
      </p>

      <h2>Current promos</h2>
      <p>
        We currently have 3 promos (links to come).
      </p>
      <ul>
        <li>Event promos</li>
        <li>Exhibition promos</li>
        <li>Article promos</li>
      </ul>
    </BodyBlock>
  </div>
);

export default DocsPromos;
