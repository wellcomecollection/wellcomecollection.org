// TODO: this exists because I couldn't get TS to compile using the slicemachine.config.json file even though `resolveJsonModule` is set to `true`. Would be good to figure out why and get rid of this file
export default {
  repositoryName: 'wellcomecollection',
  adapter: '@slicemachine/adapter-next',
  libraries: ['./views/slices'],
  localSliceSimulatorURL: 'http://localhost:3000/slice-simulator',
};
