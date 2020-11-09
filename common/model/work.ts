export interface Work {
  id: string;
  title: string;
  alternativeTitles: string[];
  referenceNumber: string;
  description: string;
  physicalDescription: string;
  workType: {
    id: string;
    label: string;
    type: string;
  };
  lettering: string;
  createdDate: {
    id: string;
    identifiers: {
      identifierType: {
        id: string;
        label: string;
        type: string;
      };
      value: string;
      type: string;
    }[];
    label: string;
    type: string;
  };
  contributors: {
    agent: {
      id: string;
      label: string;
      type: string;
    };
    roles: {
      label: string;
      type: string;
    }[];
    type: string;
  }[];
  identifiers: {
    identifierType: {
      id: string;
      label: string;
      type: string;
    };
    value: string;
    type: string;
  }[];
  subjects: {
    id: string;
    identifiers: {
      identifierType: {
        id: string;
        label: string;
        type: string;
      };
      value: string;
      type: string;
    }[];
    label: string;
    concepts: any[];
    type: string;
  }[];
  genres: {
    label: string;
    concepts: any[];
    type: string;
  }[];
  thumbnail: {
    locationType: {
      id: string;
      label: string;
      type: string;
    };
    url: string;
    credit: string;
    licence: {
      id: string;
      label: string;
      url: string;
      type: string;
    };
    accessConditions: {
      status: {
        id: string;
        label: string;
        type: string;
      };
      terms: string;
      to: string;
      type: string;
    }[];
    type: string;
    label: string;
  };
  items: {
    id: string;
    identifiers: {
      identifierType: {
        id: string;
        label: string;
        type: string;
      };
      value: string;
      type: string;
    }[];
    title: string;
    locations: {
      locationType: {
        id: string;
        label: string;
        type: string;
      };
      url: string;
      credit: string;
      license: {
        id: string;
        label: string;
        url: string;
        type: string;
      };
      accessConditions: {
        status: {
          id: string;
          label: string;
          type: string;
        };
        terms: string;
        to: string;
        type: string;
      }[];
      type: string;
      label: string;
    }[];
    type: string;
  }[];
  production: {
    label: string;
    places: {
      id: string;
      identifiers: {
        identifierType: {
          id: string;
          label: string;
          type: string;
        };
        value: string;
        type: string;
      }[];
      label: string;
      type: string;
    }[];
    agents: {
      id: string;
      label: string;
      type: string;
    }[];
    dates: {
      id: string;
      identifiers: {
        identifierType: {
          id: string;
          label: string;
          type: string;
        };
        value: string;
        type: string;
      }[];
      label: string;
      type: string;
    }[];
    function: {};
    type: string;
  }[];
  language: {
    id: string;
    label: string;
    type: string;
  };
  edition: string;
  notes: {
    contents: string[];
    noteType: {
      id: string;
      label: string;
      type: string;
    };
    type: string;
  }[];
  duration: {};
  images: {
    id: string;
    type: string;
  }[];
  parts: Work[];
  partOf: Work[];
  precededBy: Work[];
  succeededBy: Work[];
  type: 'Work';
};

