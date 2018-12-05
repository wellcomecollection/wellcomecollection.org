// @flow
import {Fragment} from 'react';
import {font, classNames} from '@weco/common/utils/classnames';

const cellStyles = {
  fontWeight: 'normal',
  verticalAlign: 'top',
  border: '1px solid #000',
  padding: '5px',
  minWidth: '80px'
};

const OpeningTimesStatic = () => (
  <Fragment>

    <p>Explore our opening hours across the different parts of our building. Keep in mind we&apos;re open late on Thursdays!</p>
    <p>We&apos;ll have <a href='#revised'>revised opening hours over the festive holidays</a>. If you&apos;re planning to visit a long time in advance, check our <a href='#planned'>planned closure dates for all of 2019.</a></p>

    <h2 className={classNames({
      [font({s: 'WB6', m: 'WB5'})]: true
    })} id='regular'>Exhibitions, Library and Reading Room</h2>

    <h3>Regular opening times</h3>

    <table className='font-HNL5-s margin-bottom-s6' style={{borderCollapse: 'collapse'}}>
      <thead className='font-HNM5-s'>
        <tr>
          <th style={cellStyles} scope='col'>
            <span className='visually-hidden'>Day</span>
          </th>
          <th style={cellStyles} scope='col'>Exhibitions</th>
          <th style={cellStyles} scope='col'>Library</th>
          <th style={cellStyles} scope='col'>Reading Room</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style={cellStyles} scope='row'>Monday</th>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>Closed</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Tuesday</th>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Wednesday</th>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Thursday</th>
          <td style={cellStyles}>10:00—22:00</td>
          <td style={cellStyles}>10:00—20:00</td>
          <td style={cellStyles}>10:00—22:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Friday</th>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Saturday</th>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Sunday</th>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>11:00—18:00</td>
        </tr>
      </tbody>
    </table>

    <h3 id='revised'>Revised hours for the festive holiday</h3>

    <table className='font-HNL5-s margin-bottom-s6' style={{borderCollapse: 'collapse'}}>
      <thead className='font-HNM5-s'>
        <tr>
          <th style={cellStyles} scope='col'>
            <span className='visually-hidden'>Day</span>
          </th>
          <th style={cellStyles} scope='col'>Exhibitions</th>
          <th style={cellStyles} scope='col'>Library</th>
          <th style={cellStyles} scope='col'>Reading Room</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style={cellStyles} scope='row'>Mon 24 Dec—<br />Wed 26 Dec</th>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>Closed</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Thur 27 Dec—<br />Sat 29 Dec</th>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>10:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Mon 31 Dec—<br />Tue 1 Jan</th>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>Closed</td>
        </tr>
      </tbody>
    </table>

    <h2 className={classNames({
      [font({s: 'WB6', m: 'WB5'})]: true
    })}>Eat and shop</h2>

    <h3>Regular opening times</h3>

    <table className='font-HNL5-s margin-bottom-s6' style={{borderCollapse: 'collapse'}}>
      <thead className='font-HNM5-s'>
        <tr>
          <th style={cellStyles} scope='col'>
            <span className='visually-hidden'>Day</span>
          </th>
          <th style={cellStyles} scope='col'>Café</th>
          <th style={cellStyles} scope='col'>Kitchen</th>
          <th style={cellStyles} scope='col'>Shop</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style={cellStyles} scope='row'>Monday</th>
          <td style={cellStyles}>8:30—18:00</td>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>9:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Tuesday</th>
          <td style={cellStyles}>8:30—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>9:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Wednesday</th>
          <td style={cellStyles}>8:30—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>9:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Thursday</th>
          <td style={cellStyles}>8:30—22:00</td>
          <td style={cellStyles}>11:00—22:00</td>
          <td style={cellStyles}>9:00—22:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Friday</th>
          <td style={cellStyles}>8:30—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>9:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Saturday</th>
          <td style={cellStyles}>8:30—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Sunday</th>
          <td style={cellStyles}>10:30—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
        </tr>
      </tbody>
    </table>

    <h3>Revised hours for the festive holiday</h3>

    <table className='font-HNL5-s margin-bottom-s6' style={{borderCollapse: 'collapse'}}>
      <thead className='font-HNM5-s'>
        <tr>
          <th style={cellStyles} scope='col'>
            <span className='visually-hidden'>Day</span>
          </th>
          <th style={cellStyles} scope='col'>Café</th>
          <th style={cellStyles} scope='col'>Kitchen</th>
          <th style={cellStyles} scope='col'>Shop</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style={cellStyles} scope='row'>Mon 24 Dec—<br />Wed 26 Dec</th>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>Closed</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Thursday 27 Dec</th>
          <td style={cellStyles}>09:30—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>09:30—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Friday 28 Dec</th>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>09:30—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Saturday 29 Dec</th>
          <td style={cellStyles}>10:00—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>10:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Sunday 30 Dec</th>
          <td style={cellStyles}>10:30—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
          <td style={cellStyles}>11:00—18:00</td>
        </tr>
        <tr>
          <th style={cellStyles} scope='row'>Mon 31 Dec—<br />Tue 1 Jan</th>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>Closed</td>
          <td style={cellStyles}>Closed</td>
        </tr>
      </tbody>
    </table>

    <h2 className={classNames({
      [font({s: 'WB6', m: 'WB5'})]: true
    })} id='planned'>Planned closure dates and revised hours for 2019</h2>
    <h3 className='h3'>Easter / Spring holidays</h3>
    <ul>
      <li>Library will be closed 30 April—2 May</li>
      <li>Everything else will be open with revised hours</li>
    </ul>

    <h3 className='h3'>Bank holidays</h3>
    <ul>
      <li>Library will be closed 6-8 May, 26—28 May and 25—27 August</li>
      <li>Everything else will be open with revised hours</li>
    </ul>

    <h3 className='h3'>Christmas and New Year&apos;s festive holidays</h3>
    <ul>
      <li>Everything will be closed from 24—26 December and 31 December—1 January</li>
      <li>Library will be closed from 24 December—1 January</li>
      <li>Everything else will be closed from 24—26 December and 31 December—1 January and have revised hours on 27—30 December</li>
    </ul>

    <div id='busy' className='body-text'><span><h2>Entry at busy times</h2><p>Our temporary exhibitions can become crowded at times, so to keep the galleries safe and comfortable, we may manage numbers with queuing or timed tickets.</p><h3>When we’re busiest</h3><p>We introduce queues for exhibitions only when necessary.</p><p>The busiest times of the week are usually Saturday and Sunday afternoons, when we often have queues for temporary exhibitions. Thursday evenings (when we’re open until 22.00) vary depending on events: you can usually go straight into the exhibitions without waiting, but sometimes you may need to queue.</p><p>On weekend mornings and weekdays (except Mondays, when the galleries are closed), you can usually go straight in.</p><p>Late Spectaculars can get very busy.</p><h3>Timed tickets</h3><p>On occasion, when queues get too long, we introduce timed tickets instead. We only give tickets to visitors who are already in the building - there’s no booking in advance or by phone. We only do this at the very busiest times - typically the opening and closing weekends of exhibitions.</p><h3>Medicine Man, Medicine Now and the Reading Room</h3><p>You can usually get into our permanent galleries without waiting, even at busy times of the week.</p><h3>Café and Kitchen</h3><p><a href='https://wellcomecollection.org/pages/Wvl1wiAAADMJ3zNe'>Wellcome Café</a>&nbsp;can sometimes get busy around lunchtime, but&nbsp;<a href='https://wellcomecollection.org/pages/Wuw19yIAAK1Z3Snk'>Wellcome Kitchen</a>&nbsp;on level 2 is usually more peaceful if you’re looking for a more intimate bite to eat.</p></span></div>
  </Fragment>
);

export default OpeningTimesStatic;
