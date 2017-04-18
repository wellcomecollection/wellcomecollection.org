import LDClient from 'ldclient-js';
import uuidV1 from 'uuid/v1';

const LDUserKey = 'LDUserKey';
const uuid = window.localStorage.getItem(LDUserKey) || uuidV1();
window.localStorage.setItem(LDUserKey, uuid);

const user = {
  key: uuid,
  anonymous: true
};

const ldclient = LDClient.initialize('58e63fe26b7519095c7484cb', user);

const getFlags = new Promise((resolve, reject) => {
  ldclient.on('ready', () => {
    const allFlags = ldclient.allFlags();
    resolve(allFlags);
  });
});

export default getFlags;
