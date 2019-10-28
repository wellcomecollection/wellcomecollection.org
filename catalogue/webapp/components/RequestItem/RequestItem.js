// @flow
import { useState } from 'react';
import { type Work } from '@weco/common/model/work';
import fetch from 'isomorphic-unfetch';

type Props = {|
  work: Work,
|};

const RequestItem = ({ work }: Props) => {
  const [patronId, setPatronId] = useState(1097124);
  return (
    <div>
      Give it me
      <input
        type="text"
        name="patronId"
        onChange={event => setPatronId(event.currentTarget.value)}
        value={patronId}
      />
      <button
        type="button"
        onClick={async () => {
          const item = work.items.find(item => item.id);
          if (item) {
            const url = `https://wxcygn7jz6.execute-api.eu-west-1.amazonaws.com/test/works/${work.id}/items/${item.id}`;
            const patron = { id: parseInt(patronId, 10) };
            const request = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(patron),
            });

            const json = await request.json();
            console.info(request.status, json);
          }
        }}
      >
        Go get {`'`}em
      </button>
    </div>
  );
};

export default RequestItem;
