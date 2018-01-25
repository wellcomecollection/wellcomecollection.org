// @flow

import BodyBlock from './BodyBlock';
import PageDescription from '../../common/views/components/PageDescription/PageDescription';

type Props = {
  breakpoints: {|small: string, medium: string, large: string, xlarge: string|},
  gridConfig: {|s: {}, m: {}, l: {}, xl: {}|}
}

const DocsVisualArchitecture = ({breakpoints, gridConfig}: Props) => (
  <div>
    <PageDescription
      title='Visual architecture'
      lead={true}
      meta={{value: `Note: the below describes a few ideals that have not yet been implemented, but it will give us and others direction.`}} />
    <BodyBlock>
      <p>The architecture we have composed consists of two parts. <a href='#structure'>Structure</a> and <a href='#style'>Style</a>.</p>

      <h2>Structure</h2>
      <a name='structure'></a>

      <h3>App shell</h3>

      <p>The app shell contains parts of the layout that rarely change as the app is used.</p>
      <p>This may contain small state changes, such as the selected state of a navigation changing.</p>
      <p>The app shell will also have a placeholder for the <a href='#page'>page</a>.</p>
      <p>The app shell may also contain <a href='#layout-elements'>layouts</a>.</p>
      <p><a href='https://developers.google.com/web/fundamentals/architecture/app-shell'>You can read this article for a more detailed description for an app shell model and it&apos;s benefits</a>.</p>

      <h3>Page</h3>
      <a name='page'></a>

      <p>The page is the content that is loaded dependent on the route requested by the client, e.g. `/explore`.</p>
      <p>The page can consist of one or more <a href='#layout-elements'>layouts</a>.</p>
      <p>The page will rarely, if ever, have <a href='#style'>styles</a>.</p>

      <h3>Layout elements</h3>
      <a name='layout-elements'></a>

      <p>Elements are intentionally stupid objects, including:</p>
      <ul>
        <li>Rows: allows styling of full width</li>
        <li>Containers: Constrains the contained content to a certain width or behavior.</li>
      </ul>

      <p>Layout elements may contain <a href='#components'>components</a>, but may not contain themselves.</p>
      <p>Layout elements will always manage their own [style](#style), but have access to <a href='#global-styles'>global styles</a>.</p>

      <h3>Components</h3>
      <a name='components'></a>

      <p>Components are the pieces of the puzzle that make up the great chunk of information within the
      application. TODO: add info.</p>

      <hr className='divider divider--keyline divider--pumice' />

      <h2>Style</h2>
      <a name='style'></a>

      <h3>Global style</h3>
      <a name='global-styles'></a>

      <p>Globally accessible, reusable styles are defined in
      <a href='https://github.com/wellcometrust/wellcomecollection.org/blob/master/client/scss/utilities/_root-scope-classes.scss'>`_root-scope-classes.scss`</a>.</p>

      <p>Where possible, we want to limit the amount of styles that need to be written when creating a new component. To this end, we have created a finite set of spacing (margin/padding) and typography classes, as well as class utility functions that simplify the process of adding these classes directly to the markup.</p>

      <h4>Typography classes</h4>
      <p>We have a <a href='/components/detail/typography.html'>predefined set of typography styles</a>. This means we can avoid redeclaring font properties every time we create a new component.</p>
      <p>Instead, there is a class for each typography style at each breakpoint, and a <code>font</code> function that simplifies the process of adding these classes to the markup.</p>
      <p>Each typography style has a name, e.g. <code>WB3</code> (the third largest Wellcome Bold style). If we want the same typography style to be output at every breakpoint, we can write the following:</p>

      <code>{`font({s: 'WB3'})`}</code>
      <br /><br />
      Alternatively, if we want to have the same style to cover both the small and medium breakpoints, and another to cover both the large and xlarge breakpoints we can write:
      <br /><br />
      <code>{`font({s: 'WB4', l: 'WB2'})`}</code>

      <p>Occasionally, we may want to reset a type style&apos;s line-height to `1`, to prevent it from introducing extra space when used in non-flowing copy. For this, we have the `line-height-1` class.</p>

      <h4>Spacing classes</h4>
      <p>In a similar manner to the typography classes above, we have helper classes that apply various amounts of margins and padding to an element at each breakpoint.</p>
      <p>Where possible, these classes should be used in preference to adding margins and padding within component scss files.</p>
      <p>There is also a <code>spacing</code> function which should be used to apply these classes to the markup. The resulting classes apply multiples of our base spacing unit (6px) to any margin or padding direction up to 60px.</p>
      <p>The filter operates on an object of breakpoint keys and values. It also takes an object as an argument, which can contain &apos;margin&apos; and/or &apos;padding&apos; keys, which in turn take an array of directions (&apos;top&apos;, &apos;bottom&apos;, &apos;left&apos;, &apos;right&apos;) on which to operate. The breakpoint values are multiplied by our base spacing unit (6px) and the resulting amount will be used as the value for whichever properties are specified in the parameter object.</p>
      <p>For example, if an element should have 12px top and bottom padding at the small and medium breakpoints, then 24px top and bottom padding at large and xlarge breakpoints, we can write:
      <br /><br />

      <code>{`spacing({s: 2, l: 4}, {padding: ['top', 'bottom']})`}</code>
      </p>
      <p>Or if an element should have 6px, 12px, 24px and 48px bottom margin at small, medium, large and xlarge breakpoints respectively, we can write:
      <br /><br />
      <code>{`spacing({s: 1, m: 2, l: 3, xl: 4}, {margin: ['bottom']})`}</code>
      </p>

      <h3>Width</h3>

      {breakpoints[breakpoints.length - 1].size}
      <p>The layout has a maximum width of {breakpoints[breakpoints.length - 1].size}.</p>

      <h3>Breakpoints</h3>

      <p>The layout utilises {breakpoints.length} breakpoints:</p>

      <ul>
        {breakpoints.map(breakpoint => (
          <li key={breakpoint.name}>`{breakpoint.name}`: {breakpoint.name === 'xlarge' ? '>' : '>='} {breakpoint.size}</li>
        ))}
      </ul>

      <h3>Grid columns/spacing</h3>
      <p>The grid consists of 12 columns and breakpoints determine the spacing between the columns, i.e. gutters, and the space either side of the layout, i.e. margins.</p>

      <ul>
        {gridConfig.map(gridSize => (
          <li key={gridSize.name}><strong>{gridSize.name}:</strong> {gridSize.gutterWidth} gutters, {gridSize.marginWidth} margins</li>
        ))}
      </ul>

      <h3>Page layout</h3>
      <p>Pages with a right-hand rail (article, work, exhibition, event) have standard column-widths at common breakpoints.</p>
      <table>
        <thead>
          <tr>
            <td>Breakpoint</td>
            <td>Main columns</td>
            <td>Aside columns</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Small</td>
            <td>`s: 12`</td>
            <td>`s: 12`</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>`m: 10, shiftM: 1`</td>
            <td>`m: 10, shiftM: 1`</td>
          </tr>
          <tr>
            <td>Large</td>
            <td>`l: 7`</td>
            <td>`l: 5`</td>
          </tr>
          <tr>
            <td>Extra large</td>
            <td>`l: 7`</td>
            <td>`l: 5`</td>
          </tr>
        </tbody>
      </table>
    </BodyBlock>
  </div>
);

export default DocsVisualArchitecture;
