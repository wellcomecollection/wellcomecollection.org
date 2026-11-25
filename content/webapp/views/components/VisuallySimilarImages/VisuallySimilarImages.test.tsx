import { act, screen } from '@testing-library/react';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';

import VisuallySimilarImages from '.';

jest.mock('@weco/content/services/wellcome/catalogue/images', () => ({
  getImage: jest.fn(),
}));

const similarImage = (id: string, title: string) => ({
  id,
  source: { id: `work-${id}`, title },
  locations: [{ url: `https://iiif.example/${id}/info.json` }],
});

describe('VisuallySimilarImages', () => {
  beforeEach(() => {
    (getImage as jest.Mock).mockResolvedValue({
      image: {
        type: 'Image',
        withSimilarFeatures: [
          similarImage('a', 'A similar <i>image</i>'),
          similarImage('b', 'Another similar image'),
        ],
      },
    });
  });

  it("names each image's button after its title, without display markup", async () => {
    renderWithTheme(
      <VisuallySimilarImages originalId="original" onClickImage={jest.fn()} />
    );
    await act(async () => {});

    expect(
      screen.getByRole('button', { name: 'A similar image' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Another similar image' })
    ).toBeInTheDocument();
  });
});
