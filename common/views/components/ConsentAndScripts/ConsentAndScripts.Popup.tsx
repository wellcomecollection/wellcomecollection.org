import { font } from '@weco/common/utils/classnames';

const ConfirmPopup = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        zIndex: 10000,
      }}
    >
      <div
        style={{
          backgroundColor: 'turquoise',
          padding: '20px',
        }}
      >
        <p className={font('intb', 3)}>Your cookie settings have been saved</p>
      </div>
    </div>
  );
};

export default ConfirmPopup;
