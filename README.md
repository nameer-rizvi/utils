# @nameer-rizvi/utils

Library of utility functions for use in personal projects.

## For Package Consumers

If you're using this as a published package, install it via:

```bash
npm install @nameer-rizvi/utils
# or
yarn add @nameer-rizvi/utils
```

### Usage

This package supports both CommonJS and ES Modules out of the box.

**ESM**

```js
import * as utils from "@nameer-rizvi/utils";
```

**CommonJS**

```js
const utils = require("@nameer-rizvi/utils");
```

## For Template Users

If you're using this as a starting point for your own package, clone and set it up:

```bash
# Clone project
git clone https://github.com/nameer-rizvi/utils.git

# Change into project
cd utils

# Install dependencies
yarn install
```

### Development

```bash
# Build CJS and ESM outputs
yarn build

# Lint source files
yarn lint

# Auto-fix lint errors
yarn lint:fix

# Test both CJS and ESM outputs
yarn test
```

## License

MIT
