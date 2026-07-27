// Runs all item viewer tests with the itemViewerRefactor toggle enabled.
// When the refactor is complete and the legacy code is removed, delete
// this file, the fixture, and the shared test module — move the tests
// back into view-items.test.ts.

import { expect, test } from './helpers/refactored-viewer';
import { defineViewItemTests } from './view-items-tests';

defineViewItemTests(test, expect);
