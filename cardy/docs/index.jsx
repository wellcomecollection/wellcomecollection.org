import BodyBlock from './BodyBlock';
import PageDescription from '../../common/views/components/PageDescription/PageDescription';
import statuses from '../config/statuses';
import {spacing} from '../../common/utils/classnames';

export default () => (
  <div>
    <PageDescription
      intro={`Wellcome Collection’s design system`}
      title='Cardigan'
      lead={true}
      meta={{value: `Welcome to Cardigan, a living repository of Wellcome Collection’s principles and patterns.`}} />
    <div className={spacing({s: 3, m: 5, l: 10}, {margin: ['top']})}>
      <img src='/cardigan-theme/assets/images/cardigan.jpg' alt='' />
    </div>
    <BodyBlock>
      <p><a href='https://wellcomecollection.org/explore'>Explore</a> and <a href='https://wellcomecollection.org/works'>images search</a> are currently running on Cardigan.</p>

      <p>All code is available to peruse in our <a href='https://github.com/wellcometrust/wellcomecollection.org'>Github repo</a></p>

      <h2 id='adding_notes_to_a_component'>Adding notes to a component</h2>
      <p><a href='https://github.com/wellcometrust/wellcomecollection.org/tree/master/server/views/components'>Browse to the component</a> you would like to add notes to. Add a <code>README.md</code>, submit a PR, and we're away.</p>

      <h2>Status codes</h2>
      <p>Components and their variants have been given statuses reflecting their state of completion. The available statuses are listed below.</p>
      <table>
        <tbody>
          {Object.keys(statuses).map(status => {
            const styles = {
              background: statuses[status].color,
              display: 'inline-block',
              padding: '0.2em 0.5em',
              borderRadius: '6px',
              color: '#fff',
              fontFamliy: 'Wellcome Bold Web'
            };
            return (
              <tr>
                <td><span style={styles}>{statuses[status].label}</span></td>
                <td>{statuses[status].description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </BodyBlock>
  </div>
);
