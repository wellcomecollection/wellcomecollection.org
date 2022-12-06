import styled from 'styled-components';

const Issue = styled.div<{ type: string }>`
  padding: 12px;
  margin: 12px 0px;
  ${props =>
    props.type === 'error'
      ? `
      border: 1px solid rgba(224, 27, 47, 1);
      background: rgba(224, 27, 47, 0.25);
    `
      : ''}
  ${props =>
    props.type === 'warning'
      ? `
      border: 1px solid rgba(232, 117, 0, 1);
      background: rgba(232, 117, 0, 0.25);
    `
      : ''}
  ${props =>
    props.type === 'notice'
      ? `
      border: 1px solid rgba(92, 184, 191, 1);
      background: rgba(92, 184, 191, 0.25);
    `
      : ''}

  // This is the validation green from the global palette
  ${props =>
    props.type === 'success'
      ? `
          border: 1px solid rgba(11, 112, 81, 1);
          background: rgba(11, 112, 81, 0.1);
        `
      : ''}
`;

export default Issue;
