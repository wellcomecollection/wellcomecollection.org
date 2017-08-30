import mockJson from '../../test/mocks/wellcomecollection-api.json';

export const name = 'work';
export const handle = 'work-template';
export const status = 'wip';

export const context = {
  // temp license, img, etc. data until we know how this is coming from the API
  work: Object.assign({}, mockJson, {
    license: 'CC BY-NC',
    imgLink: 'https://wellcomecollection-miro-images.imgix.net/V0047000/V0047696.jpg',
    imgWidth: 1000,
    moreInfo: [
      {
        title: "Curator's intro",
        content: 'Suspendisse ac pharetra sapien. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse neque ex, vehicula eu accumsan nec, vulputate molestie augue. Etiam pharetra tortor sit amet erat ullamcorper, quis fermentum lacus elementum.'
      },
      {
        title: 'Essay',
        content: 'Nullam nec tincidunt erat. Suspendisse convallis purus at libero lacinia elementum. Phasellus tincidunt accumsan lorem, in dapibus sem interdum eu. Vestibulum ultrices lorem elit, id porta quam ullamcorper ac. Suspendisse congue justo sed molestie scelerisque.'
      },
      {
        title: 'Description',
        content: 'Maecenas dictum, velit luctus tempor scelerisque, est ligula laoreet arcu, vitae sollicitudin urna magna placerat purus. Nulla pulvinar felis sed ligula hendrerit faucibus.'
      }
    ],
    usingImage: [
      {
        title: 'License type',
        licenseType: 'CC-BY-NC',
        content: 'Phasellus a tortor ac lacus ultricies rhoncus. Maecenas dictum, velit luctus tempor scelerisque, est ligula laoreet arcu, vitae sollicitudin urna magna placerat purus.'
      }
    ]
  })
};
