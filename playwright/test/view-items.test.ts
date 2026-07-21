import { expect, test } from '@playwright/test';

import { defineViewItemTests } from './view-items-tests';

defineViewItemTests(test, expect);
