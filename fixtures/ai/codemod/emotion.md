We have a typescript file uses a css-in-js solution @emotion.
Please rewrite it to use SCSS-modules instead.
The generated SCSS file should be on top and the modified TypeScript file on the bottom.
Use css-variables instead of SCSS variables when possible.
Remove @emotion related styles and imports. 
Only return a single example. 
Do not include any other comments or prose.

Here is an example of initial file and what is expected after the conversion:

For the following code:

```js
import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { fontWeightSemibold, guttersPx, gutters } from "styles/variables";
import { typographyH3 } from "styles/typography";
import Reason from "./reason";

const Item = styled.div<{}>([
  typographyH3,
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      margin-bottom: ${gutters.large}px;
      color: ${theme.colors.primary};
      font-weight: ${fontWeightSemibold};
      line-height: 1;
      gap: ${guttersPx.small};
    `,
]);

export const Reasons = ({ title }: { title: string }) => {
  return (
    <Reason ssrOnly>
      return (
        <Item>{title}</Item>
      );
    </Reason>
  );
};
```

An SCSS refactor results in:

```js
// SCSS

.item {
  display: flex;
  align-items: center;
  margin-bottom: var(--gutters-large);
  color: var(--colors-primary);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  gap: var(--gutters-px-small);
}

// TypeScript

import React from "react";

import Reason from "./reason";
import css from "./index.module.scss";

export const Reasons = ({ title }: { title: string }) => {
  return (
    <Reason ssrOnly>
      return (
        <div className={css.item}>{title}</div>
      );
    </Reason>
  );
};
```    

If everything is ok, please confirm and I'll send the first file